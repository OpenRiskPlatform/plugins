#!/usr/bin/env python3
"""Generate plugins.json index from all plugin.json manifests in the repo."""

import datetime
import json
import sys
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
OUTPUT = ROOT / "plugins.json"

KEYS = [
    "id", "version", "name", "description",
    "authors", "license", "main", "entrypoints",
    "keywords", "icon", "repository", "homepage",
]

SKIP_DIRS = {"node_modules"}


def should_skip(path: Path) -> bool:
    return any(
        p.startswith(".") or p in SKIP_DIRS
        for p in path.parts[:-1]
    )


def main() -> None:
    plugins = []

    for manifest_path in sorted(ROOT.rglob("plugin.json")):
        if should_skip(manifest_path):
            continue

        try:
            data = json.loads(manifest_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            print(f"::warning file={manifest_path}::Invalid JSON – {exc}", flush=True)
            continue

        entry = {"path": manifest_path.relative_to(ROOT).as_posix()}
        for key in KEYS:
            if key in data:
                entry[key] = data[key]

        plugins.append(entry)
        print(f"Indexed {manifest_path.relative_to(ROOT)}", flush=True)

    index = {
        "$schema": "TODO",
        "generatedAt": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "plugins": plugins,
    }

    OUTPUT.write_text(
        json.dumps(index, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT} with {len(plugins)} plugin(s).", flush=True)


if __name__ == "__main__":
    main()
