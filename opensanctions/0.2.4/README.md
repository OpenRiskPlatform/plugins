# OpenSanctions

Matches a person name against [OpenSanctions](https://www.opensanctions.org) and returns normalized person entities.

Version `0.2.4` enriches matched people with relatives and close associates when OpenSanctions exposes nested relationship data. RCA enrichment is always attempted for the first 20 person matches.

## Settings

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `token` | secret string | **Yes** | API token for authenticated requests to the OpenSanctions API. |

## Entrypoints

### `match-persons`

Matches a free-text person name against the OpenSanctions database.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `search_input` | string | Yes | Free-text person name to match. |
| `dataset` | string | No | OpenSanctions dataset scope, defaulting to `default`. |
| `limit` | number | No | Maximum number of matches requested from OpenSanctions. |
| `threshold` | number | No | Lower score bound for returned matches. |
