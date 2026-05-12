# Adversea

Risk screening integration powered by [Adversea](https://adversea.com). Covers PEP/sanctions checks, adverse media topic reports, and per-URL unit analysis.

## Settings

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `api_key` | secret string | **Yes** | Your Adversea API key sent as `X-Adversea-Api-Key`. |

## Entrypoints

### `pep-sanctions` — PEP & Sanctions Check

Checks PEP exposure and active sanctions datasets for the target name.

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `target` | string | **Yes** | — | Full name of the person or organization to screen. |
| `force_recreate` | boolean | No | `false` | Bypass cache and refresh all response parts. |

### `topic-report` — Topic Report

Adverse media analysis grouped by risk topics (financial crime, corruption, legal, etc.).

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `target` | string | **Yes** | — | Full name of the person or organization to screen. |
| `output_language` | `English` \| `Slovak` | No | `English` | Language for generated text output. |
| `country` | enum (see below) | No | — | Country of origin of websites. Increases accuracy. |
| `force_recreate` | boolean | No | `false` | Bypass cache and refresh all response parts. |

### `unit-analysis` — Unit Analysis

Analyzes search engine results for each URL. Returns either concise text summaries or atomic facts per URL.

| Input | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `target` | string | **Yes** | — | Name of the screened person or company. |
| `mode` | `text` \| `claims` | No | `text` | `text` = concise analysis per URL; `claims` = atomic facts per URL. |
| `output_language` | `English` \| `Slovak` | No | `English` | Language for generated text. |
| `country` | enum (see below) | No | — | Country of origin of websites. Increases accuracy. |
| `media_only` | boolean | No | `false` | Restrict analysis to internet media sources only. |
| `force_recreate` | boolean | No | `false` | Bypass cache and refresh all response parts. |

## Country Values

`usa`, `australia`, `new_zealand`, `great_britain`, `germany`, `czechia`, `slovakia`, `italy`, `austria`, `belgium`, `bulgaria`, `croatia`, `cyprus`, `denmark`, `estonia`, `finland`, `france`, `greece`, `hungary`, `ireland`, `latvia`, `lithuania`, `luxembourg`, `malta`, `netherlands`, `poland`, `portugal`, `romania`, `slovenia`, `spain`, `sweden`

## Metrics

| Name | Type | Description |
|------|------|-------------|
| `status` | string | Current Adversea account credit balance in EUR. |
