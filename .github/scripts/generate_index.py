#!/usr/bin/env python3
"""
Generate plugins.json index from versioned plugin manifests.

Expected layout:
    <plugin-id>/
        <semver>/
            plugin.json
            ...
        latest -> <semver>   (symlink, managed by this script)

The script:
  1. Finds all plugin.json files at exactly depth 2 from ROOT.
  2. Groups them by plugin directory.
  3. Resolves the latest version via semver sorting.
  4. Creates / updates the `latest` symlink inside each plugin dir.
  5. Writes the root plugins.json index.
"""

import datetime
import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(".").resolve()
OUTPUT = ROOT / "plugins.json"

KEYS = [
    "id", "version", "name", "description",
    "authors", "license", "main", "entrypoints",
    "keywords", "icon", "repository", "homepage",
]

SKIP_DIRS = {"node_modules", ".github", ".git"}


# ---------------------------------------------------------------------------
# Semver helpers
# ---------------------------------------------------------------------------

_SEMVER_RE = re.compile(
    r'^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>0|[1-9]\d*)'
    r'(?:-(?P<pre>[\w.]+))?(?:\+[\w.]+)?$'
)


def _semver_key(version: str):
    """Return a sort key: higher = more recent. Stable > pre-release."""
    m = _SEMVER_RE.match(version)
    if not m:
        return (0, 0, 0, True, version)  # unparseable sorts first (lowest)
    major, minor, patch = int(m.group("major")), int(m.group("minor")), int(m.group("patch"))
    pre = m.group("pre")
    # stable (no pre-release) should sort HIGHER than pre-release
    return (major, minor, patch, pre is None, pre or "")


def latest_version(versions: list[str]) -> str:
    return max(versions, key=_semver_key)


# ---------------------------------------------------------------------------
# Discovery
# ---------------------------------------------------------------------------

def should_skip(path: Path) -> bool:
    """Skip paths that pass through hidden dirs, node_modules, or 'latest'."""
    for part in path.relative_to(ROOT).parts[:-1]:
        if part.startswith(".") or part in SKIP_DIRS or part == "latest":
            return True
    return False


def find_versioned_manifests() -> dict[Path, list[str]]:
    """
    Return {plugin_dir: [version, ...]} for all plugin.json files found at
    exactly ROOT/<plugin>/<version>/plugin.json.
    """
    grouped: dict[Path, list[str]] = defaultdict(list)

    for manifest in ROOT.rglob("plugin.json"):
        if should_skip(manifest):
            continue
        rel = manifest.relative_to(ROOT)
        # Must be exactly <plugin>/<version>/plugin.json
        if len(rel.parts) != 3:
            print(
                f"::warning file={rel}::Skipped – expected <plugin>/<version>/plugin.json",
                flush=True,
            )
            continue
        plugin_dir = ROOT / rel.parts[0]
        version = rel.parts[1]
        grouped[plugin_dir].append(version)

    return grouped


# ---------------------------------------------------------------------------
# Symlink management
# ---------------------------------------------------------------------------

def update_latest_symlink(plugin_dir: Path, target_version: str) -> bool:
    """Create or update plugin_dir/latest -> target_version. Returns True if changed."""
    link = plugin_dir / "latest"
    if link.is_symlink():
        if os.readlink(link) == target_version:
            return False
        link.unlink()
    elif link.exists():
        raise RuntimeError(f"{link} exists and is not a symlink – refusing to overwrite.")
    os.symlink(target_version, link)
    print(f"  symlink {link.relative_to(ROOT)} -> {target_version}", flush=True)
    return True


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    grouped = find_versioned_manifests()
    if not grouped:
        print("No versioned plugin manifests found.", flush=True)

    plugins = []

    for plugin_dir in sorted(grouped):
        versions = grouped[plugin_dir]
        best = latest_version(versions)
        all_versions = sorted(versions, key=_semver_key, reverse=True)

        print(f"Plugin {plugin_dir.name}: versions={all_versions}, latest={best}", flush=True)
        update_latest_symlink(plugin_dir, best)

        manifest_path = plugin_dir / best / "plugin.json"
        try:
            data = json.loads(manifest_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            print(f"::warning file={manifest_path}::Invalid JSON – {exc}", flush=True)
            continue

        entry = {
            "path": (plugin_dir / "latest" / "plugin.json").relative_to(ROOT).as_posix(),
            "versions": all_versions,
        }
        for key in KEYS:
            if key in data:
                entry[key] = data[key]

        plugins.append(entry)

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
