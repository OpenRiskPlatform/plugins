# OpenCorporates

Searches companies and officers in [OpenCorporates](https://opencorporates.com) — the world's largest open database of companies — and returns normalized OpenRisk entities.

## Settings

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `token` | string | **Yes** | API token for authenticated requests to OpenCorporates. |

## Entrypoints

### `companies` — Company Search

Searches OpenCorporates companies and returns `organization` entities.

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `search_input` | string | **Yes** | — | Free-text company name to search in OpenCorporates. |
| `jurisdiction_code` | string | No | — | ISO 3166-2 jurisdiction code, e.g. `gb`, `us_de`, `sk`. |
| `limit` | number | No | `50` | Total entities to return across paginated requests (1–200). |
| `inactive` | boolean | No | — | `true` = inactive only; `false` = active only; omit = all. |

### `officers` — Officer Search

Searches OpenCorporates officers and returns `person` entities.

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `search_input` | string | **Yes** | — | Free-text officer name to search in OpenCorporates. |
| `jurisdiction_code` | string | No | — | ISO 3166-2 jurisdiction code, e.g. `gb`, `us_de`, `sk`. |
| `limit` | number | No | `50` | Total entities to return across paginated requests (1–200). |
| `inactive` | boolean | No | — | `true` = inactive only; `false` = active only; omit = all. |

## Metrics

| Name | Type | Description |
|------|------|-------------|
| `status` | string | Short summary of the current OpenCorporates API quota or remaining requests. |
| `api_requests` | integer | Number of OpenCorporates HTTP requests made during execution. |
| `result_count` | integer | Number of normalized entities returned. |
| `requested_limit` | integer | Requested total result limit for the run. |
| `pages_fetched` | integer | Number of paginated result pages fetched. |
| `api_total_count` | integer | Total count reported by OpenCorporates for the query. |
| `last_status_code` | integer | HTTP status code from the last API request. |
