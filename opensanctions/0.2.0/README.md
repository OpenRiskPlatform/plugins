# OpenSanctions

Matches a person name against [OpenSanctions](https://www.opensanctions.org) and returns normalized person entities.

## Settings

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `token` | string | No | API token for authenticated requests to the OpenSanctions API. |

## Entrypoints

### `match-persons`

Matches a free-text person name against the OpenSanctions database.

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `search_input` | string | Yes | Free-text person name to match. |
