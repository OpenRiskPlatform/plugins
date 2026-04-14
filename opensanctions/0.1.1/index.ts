/**
 * OpenSanctions Plugin
 *
 * Uses OpenSanctions matching API and maps responses into OpenRisk canonical entities.
 */

// === BEGIN openrisk-types (subset used by this plugin) ===
interface TypedValue<T = unknown> {
  $type: string;
  value: T;
}

interface _OR_KV {
  $type: "key-value";
  value: { key: TypedValue<string>; value: TypedValue };
}

interface DataModelEntity {
  $entity: string;
  $id: string;
  $sources?: Array<{ name: string; source: string }>;
  $props?: Record<string, TypedValue[]>;
  $extra?: _OR_KV[];
}

interface PersonPayload {
  name: string;
  aliases?: string[];
  birthDate?: string;
  birthPlace?: string;
  nationalities?: string[];
  addresses?: string[];
  isPep?: boolean;
  pepDatasets?: string[];
  isSanctioned?: boolean;
  sanctionDatasets?: string[];
  notes?: string;
}

interface OrganizationPayload {
  name: string;
  aliases?: string[];
  registrationId?: string;
  country?: string;
  address?: string;
  status?: "active" | "inactive" | "unknown";
  sourceRegister?: string;
  isPep?: boolean;
  pepDatasets?: string[];
  isSanctioned?: boolean;
  sanctionDatasets?: string[];
}

interface _OR_Opts<P> {
  id: string;
  payload: P;
  sources?: Array<{ name: string; source: string }>;
  extra?: Record<string, string | number | boolean | null | undefined>;
}

const _tv = {
  str: (v: string): TypedValue<string> => ({ $type: "string", value: v }),
  num: (v: number): TypedValue<number> => ({ $type: "number", value: v }),
  bool: (v: boolean): TypedValue<boolean> => ({ $type: "boolean", value: v }),
  addr: (v: string): TypedValue<string> => ({ $type: "address", value: v }),
  date: (v: string): TypedValue<string> => ({
    $type: /^\d{4}-\d{2}-\d{2}T/.test(v)
      ? "date-time-iso8601"
      : /^\d{4}-\d{2}-\d{2}$/.test(v)
        ? "date-iso8601"
        : /^\d{4}(-\d{2})?$/.test(v)
          ? "date-partial-iso8601"
          : "string",
    value: v,
  }),
};

function _or_set(
  props: Record<string, TypedValue[]>,
  key: string,
  val: TypedValue | undefined,
): void {
  if (val !== undefined) (props[key] ??= []).push(val);
}

function _or_many(
  props: Record<string, TypedValue[]>,
  key: string,
  vals: TypedValue[],
): void {
  if (vals.length) (props[key] ??= []).push(...vals);
}

function _or_kv(key: string, val: TypedValue): _OR_KV {
  const label = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { $type: "key-value", value: { key: _tv.str(label), value: val } };
}

function _or_extra(
  bag?: Record<string, string | number | boolean | null | undefined>,
): _OR_KV[] {
  if (!bag) return [];
  return Object.entries(bag)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) =>
      _or_kv(
        k,
        typeof v === "boolean"
          ? _tv.bool(v)
          : typeof v === "number"
            ? _tv.num(v)
            : _tv.str(String(v)),
      )
    );
}

function buildPerson(opts: _OR_Opts<PersonPayload>): DataModelEntity {
  const p = opts.payload;
  const props: Record<string, TypedValue[]> = {};

  _or_set(props, "name", _tv.str(p.name));
  _or_many(props, "aliases", (p.aliases ?? []).map(_tv.str));
  _or_set(props, "birthDate", p.birthDate ? _tv.date(p.birthDate) : undefined);
  _or_set(props, "birthPlace", p.birthPlace ? _tv.str(p.birthPlace) : undefined);
  _or_many(props, "nationalities", (p.nationalities ?? []).map(_tv.str));
  _or_many(props, "addresses", (p.addresses ?? []).map(_tv.addr));
  _or_set(props, "notes", p.notes ? _tv.str(p.notes) : undefined);
  _or_set(props, "pepStatus", p.isPep !== undefined ? _tv.bool(p.isPep) : undefined);
  _or_set(
    props,
    "sanctioned",
    p.isSanctioned !== undefined ? _tv.bool(p.isSanctioned) : undefined,
  );

  const extra = _or_extra(opts.extra);
  for (const ds of p.pepDatasets ?? []) extra.push(_or_kv("pep_dataset", _tv.str(ds)));
  for (const ds of p.sanctionDatasets ?? []) {
    extra.push(_or_kv("sanction_dataset", _tv.str(ds)));
  }

  return {
    $entity: "entity.person",
    $id: opts.id,
    $props: props,
    $extra: extra.length ? extra : undefined,
    $sources: opts.sources,
  };
}

function buildOrganization(opts: _OR_Opts<OrganizationPayload>): DataModelEntity {
  const p = opts.payload;
  const props: Record<string, TypedValue[]> = {};

  _or_set(props, "name", _tv.str(p.name));
  _or_many(props, "aliases", (p.aliases ?? []).map(_tv.str));
  _or_set(
    props,
    "registrationId",
    p.registrationId ? _tv.str(p.registrationId) : undefined,
  );
  _or_set(props, "country", p.country ? _tv.str(p.country) : undefined);
  _or_set(props, "address", p.address ? _tv.addr(p.address) : undefined);
  _or_set(props, "status", p.status ? _tv.str(p.status) : undefined);
  _or_set(props, "sourceRegister", p.sourceRegister ? _tv.str(p.sourceRegister) : undefined);
  _or_set(props, "pepStatus", p.isPep !== undefined ? _tv.bool(p.isPep) : undefined);
  _or_set(
    props,
    "sanctioned",
    p.isSanctioned !== undefined ? _tv.bool(p.isSanctioned) : undefined,
  );

  const extra = _or_extra(opts.extra);
  for (const ds of p.pepDatasets ?? []) extra.push(_or_kv("pep_dataset", _tv.str(ds)));
  for (const ds of p.sanctionDatasets ?? []) {
    extra.push(_or_kv("sanction_dataset", _tv.str(ds)));
  }

  return {
    $entity: "entity.organization",
    $id: opts.id,
    $props: props,
    $extra: extra.length ? extra : undefined,
    $sources: opts.sources,
  };
}
// === END openrisk-types ===

const OPENSANCTIONS_API_URL = "https://api.opensanctions.org";
const OPENSANCTIONS_ENTITY_URL = "https://www.opensanctions.org/entities";

interface PluginInputs {
  search_input?: string;
  token?: string;
  dataset?: string;
  limit?: number;
  threshold?: number;
}

interface OpenSanctionsEntity {
  id: string;
  caption?: string;
  schema: string;
  properties?: Record<string, string[] | undefined>;
  datasets?: string[];
  referents?: string[];
  first_seen?: string;
  last_seen?: string;
  last_change?: string;
  target?: boolean;
  score?: number;
  match?: boolean;
  explanations?: Record<string, unknown>;
}

interface MatchResponse {
  responses?: {
    entity1?: {
      results?: OpenSanctionsEntity[];
      total?: { value?: number };
    };
  };
}

function metricSet(name: string, value: unknown): void {
  (globalThis as any).openrisk?.metrics?.set?.(name, value);
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const normalized = value?.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

function getPropertyValues(
  properties: Record<string, string[] | undefined>,
  keys: string[],
): string[] {
  return uniqueStrings(keys.flatMap((key) => properties[key] ?? []));
}

function resolveDataset(value: unknown): string {
  const v = typeof value === "string" ? value.trim() : "";
  return v.length > 0 ? v : "default";
}

function resolveLimit(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(1, Math.min(500, Math.floor(value)));
  }
  return 50;
}

function resolveThreshold(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(1, value));
  }
  return 0.7;
}

function hasTopic(topics: string[], token: string): boolean {
  const needle = token.toLowerCase();
  return topics.some((topic) => topic.toLowerCase().includes(needle));
}

function normalizeSources(dataset: string, entityId: string, limit: number, threshold: number) {
  const url = new URL(`/match/${encodeURIComponent(dataset)}`, OPENSANCTIONS_API_URL);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("threshold", String(threshold));

  return [
    { name: "OpenSanctions API", source: url.toString() },
    {
      name: "OpenSanctions entity",
      source: `${OPENSANCTIONS_ENTITY_URL}/${encodeURIComponent(entityId)}/`,
    },
  ];
}

function entityExtra(entity: OpenSanctionsEntity): Record<string, string | number | boolean> {
  const extra: Record<string, string | number | boolean> = {
    schema: entity.schema,
  };

  if (typeof entity.score === "number") extra.score = entity.score;
  if (typeof entity.match === "boolean") extra.match = entity.match;
  if (typeof entity.target === "boolean") extra.target = entity.target;
  if (entity.first_seen) extra.first_seen = entity.first_seen;
  if (entity.last_seen) extra.last_seen = entity.last_seen;
  if (entity.last_change) extra.last_change = entity.last_change;
  if (entity.datasets?.length) extra.datasets = entity.datasets.join(", ");
  if (entity.referents?.length) extra.referents = entity.referents.join(", ");
  if (entity.explanations) {
    extra.explanations_json = JSON.stringify(entity.explanations);
  }

  return extra;
}

function normalizePersonEntity(
  entity: OpenSanctionsEntity,
  dataset: string,
  limit: number,
  threshold: number,
): DataModelEntity {
  const properties = entity.properties ?? {};

  const topics = getPropertyValues(properties, ["topics"]);
  const name = (entity.caption?.trim() || getPropertyValues(properties, ["name"])[0] || "Unknown person").trim();

  const aliases = getPropertyValues(properties, ["alias", "weakAlias", "previousName"]);
  const birthDates = getPropertyValues(properties, ["birthDate"]);
  const birthPlaces = getPropertyValues(properties, ["birthPlace", "placeOfBirth"]);
  const nationalities = getPropertyValues(properties, ["nationality", "citizenship"]);
  const addresses = getPropertyValues(properties, ["address"]);

  const notes = uniqueStrings([
    ...getPropertyValues(properties, ["description", "notes", "summary"]),
    topics.length ? `topics: ${topics.join(", ")}` : undefined,
  ])[0];

  return buildPerson({
    id: `opensanctions:${entity.id}`,
    sources: normalizeSources(dataset, entity.id, limit, threshold),
    payload: {
      name,
      aliases,
      birthDate: birthDates[0],
      birthPlace: birthPlaces[0],
      nationalities,
      addresses,
      notes,
      isPep: hasTopic(topics, "pep") ? true : undefined,
      pepDatasets: hasTopic(topics, "pep") ? uniqueStrings(entity.datasets ?? []) : undefined,
      isSanctioned: hasTopic(topics, "sanction") ? true : undefined,
      sanctionDatasets: hasTopic(topics, "sanction")
        ? uniqueStrings(entity.datasets ?? [])
        : undefined,
    },
    extra: {
      ...entityExtra(entity),
    },
  });
}

function normalizeOrganizationEntity(
  entity: OpenSanctionsEntity,
  dataset: string,
  limit: number,
  threshold: number,
): DataModelEntity {
  const properties = entity.properties ?? {};

  const topics = getPropertyValues(properties, ["topics"]);
  const name =
    (entity.caption?.trim() || getPropertyValues(properties, ["name"])[0] || "Unknown organization").trim();

  const aliases = getPropertyValues(properties, ["alias", "previousName"]);
  const registrationIds = getPropertyValues(properties, [
    "registrationNumber",
    "idNumber",
    "taxNumber",
    "inn",
    "leiCode",
  ]);
  const countries = getPropertyValues(properties, ["country", "jurisdiction"]);
  const addresses = getPropertyValues(properties, ["address"]);
  const statuses = getPropertyValues(properties, ["status"]);

  const status: "active" | "inactive" | "unknown" = (() => {
    const raw = (statuses[0] ?? "").toLowerCase();
    if (raw.includes("active")) return "active";
    if (raw.includes("inactive") || raw.includes("dissolved")) return "inactive";
    return "unknown";
  })();

  return buildOrganization({
    id: `opensanctions:${entity.id}`,
    sources: normalizeSources(dataset, entity.id, limit, threshold),
    payload: {
      name,
      aliases,
      registrationId: registrationIds[0],
      country: countries[0],
      address: addresses[0],
      status,
      sourceRegister: "OpenSanctions",
      isPep: hasTopic(topics, "pep") ? true : undefined,
      pepDatasets: hasTopic(topics, "pep") ? uniqueStrings(entity.datasets ?? []) : undefined,
      isSanctioned: hasTopic(topics, "sanction") ? true : undefined,
      sanctionDatasets: hasTopic(topics, "sanction")
        ? uniqueStrings(entity.datasets ?? [])
        : undefined,
    },
    extra: {
      ...entityExtra(entity),
    },
  });
}

function isPersonSchema(schema: string): boolean {
  return schema.toLowerCase() === "person";
}

/**
 * Matches a person name against OpenSanctions and returns normalized entities.
 */
export async function matchPersons(inputs: PluginInputs): Promise<DataModelEntity[]> {
  const searchInput = inputs.search_input?.trim();
  const token = inputs.token?.trim();

  if (!searchInput) {
    throw new Error("search_input is required");
  }

  if (!token) {
    throw new Error("token is required");
  }

  const dataset = resolveDataset(inputs.dataset);
  const limit = resolveLimit(inputs.limit);
  const threshold = resolveThreshold(inputs.threshold);

  const url = new URL(`/match/${encodeURIComponent(dataset)}`, OPENSANCTIONS_API_URL);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("threshold", String(threshold));

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `ApiKey ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      queries: {
        entity1: {
          schema: "Person",
          properties: {
            name: [searchInput],
          },
        },
      },
    }),
  });

  metricSet("last_status_code", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenSanctions request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as MatchResponse;
  const results = data.responses?.entity1?.results ?? [];
  metricSet("api_total_count", data.responses?.entity1?.total?.value ?? results.length);

  const entities = results.map((entity) =>
    isPersonSchema(entity.schema)
      ? normalizePersonEntity(entity, dataset, limit, threshold)
      : normalizeOrganizationEntity(entity, dataset, limit, threshold)
  );

  metricSet("result_count", entities.length);
  metricSet("requested_limit", limit);

  return entities;
}
