/**
 * OpenCorporates Plugin
 *
 * Searches companies and officers with pagination and maps responses into
 * OpenRisk canonical entities.
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
  $modelVersion: "0.0.2";
  $entity: string;
  $id: string;
  $sources?: Array<{ name: string; source: string }>;
  $props?: Record<string, TypedValue[]>;
  $extra?: _OR_KV[];
}

const OPENRISK_DATA_MODEL_VERSION = "0.0.2" as const;

interface BusinessSubject {
  description: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

const OPENRISK_JURISDICTION_ISO_3166_2_CODES = [
  "ae_az", "ae_du", "al", "au", "aw", "bb", "bd", "be", "bg", "bh", "bl",
  "bm", "bo", "br", "bs", "by", "bz", "ca", "ca_bc", "ca_nb", "ca_nl",
  "ca_ns", "ca_nu", "ca_on", "ca_pe", "ca_qc", "ch", "cw", "cy", "cz", "de",
  "dk", "do", "es", "fi", "fr", "gb", "gf", "gg", "gi", "gl", "gp", "gr",
  "hk", "hr", "ie", "il", "im", "in", "ir", "is", "je", "jm", "jp", "kh",
  "li", "lu", "lv", "md", "me", "mf", "mm", "mq", "mt", "mu", "mx", "my",
  "nc", "nl", "no", "nz", "pa", "pf", "pk", "pl", "pm", "pr", "re", "ro",
  "rw", "se", "sg", "si", "sk", "th", "tj", "tn", "to", "tz", "ua", "ug",
  "us_ak", "us_al", "us_ar", "us_az", "us_ca", "us_co", "us_ct", "us_dc",
  "us_de", "us_fl", "us_ga", "us_hi", "us_ia", "us_id", "us_il", "us_in",
  "us_ks", "us_ky", "us_la", "us_ma", "us_md", "us_me", "us_mi", "us_mn",
  "us_mo", "us_ms", "us_mt", "us_nc", "us_nd", "us_ne", "us_nh", "us_nj",
  "us_nm", "us_nv", "us_ny", "us_oh", "us_ok", "us_or", "us_pa", "us_ri",
  "us_sc", "us_sd", "us_tn", "us_tx", "us_ut", "us_va", "us_vt", "us_wa",
  "us_wi", "us_wv", "us_wy", "vn", "vu", "wf", "yt", "za",
] as const;

type JurisdictionIso31662Code =
  typeof OPENRISK_JURISDICTION_ISO_3166_2_CODES[number];

const OPENRISK_JURISDICTION_ISO_3166_2_SET = new Set<string>(
  OPENRISK_JURISDICTION_ISO_3166_2_CODES,
);

interface PersonPayload {
  name: string;
  aliases?: string[];
  birthDate?: string;
  nationalities?: string[];
  jurisdiction?: JurisdictionIso31662Code;
  addresses?: string[];
  notes?: string;
}

interface OrganizationPayload {
  name: string;
  aliases?: string[];
  previousNames?: string[];
  registrationId?: string;
  country?: string;
  jurisdiction?: JurisdictionIso31662Code;
  address?: string;
  status?: "active" | "inactive" | "unknown";
  legalRoles?: string[];
  sourceRegister?: string;
  entryTypes?: string[];
  businessSubjects?: BusinessSubject[];
  effectiveTo?: string;
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
  jurisdiction: (v: JurisdictionIso31662Code): TypedValue<JurisdictionIso31662Code> => ({
    $type: "jurisdiction-iso-3166-2",
    value: v,
  }),
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
  _or_many(props, "nationalities", (p.nationalities ?? []).map(_tv.str));
  _or_set(
    props,
    "jurisdiction",
    p.jurisdiction ? _tv.jurisdiction(p.jurisdiction) : undefined,
  );
  _or_many(props, "addresses", (p.addresses ?? []).map(_tv.addr));
  _or_set(props, "notes", p.notes ? _tv.str(p.notes) : undefined);

  const extra = _or_extra(opts.extra);

  return {
    $modelVersion: OPENRISK_DATA_MODEL_VERSION,
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
  _or_set(
    props,
    "jurisdiction",
    p.jurisdiction ? _tv.jurisdiction(p.jurisdiction) : undefined,
  );
  _or_set(props, "address", p.address ? _tv.addr(p.address) : undefined);
  _or_set(props, "status", p.status ? _tv.str(p.status) : undefined);
  _or_many(props, "legalRoles", (p.legalRoles ?? []).map(_tv.str));
  _or_many(props, "previousNames", (p.previousNames ?? []).map(_tv.str));
  _or_many(props, "entryTypes", (p.entryTypes ?? []).map(_tv.str));
  _or_set(props, "sourceRegister", p.sourceRegister ? _tv.str(p.sourceRegister) : undefined);
  _or_set(props, "effectiveTo", p.effectiveTo ? _tv.date(p.effectiveTo) : undefined);

  const extra = _or_extra(opts.extra);
  for (const [i, bs] of (p.businessSubjects ?? []).entries()) {
    const n = i + 1;
    extra.push(_or_kv(`business_subject_${n}`, _tv.str(bs.description)));
    if (bs.effectiveFrom) extra.push(_or_kv(`business_subject_${n}_from`, _tv.date(bs.effectiveFrom)));
    if (bs.effectiveTo) extra.push(_or_kv(`business_subject_${n}_to`, _tv.date(bs.effectiveTo)));
  }

  return {
    $modelVersion: OPENRISK_DATA_MODEL_VERSION,
    $entity: "entity.organization",
    $id: opts.id,
    $props: props,
    $extra: extra.length ? extra : undefined,
    $sources: opts.sources,
  };
}
// === END openrisk-types ===

const OPENCORPORATES_API_URL = "https://api.opencorporates.com/v0.4";
const MAX_LIMIT = 200;
const MAX_PAGES = 30;
const DEFAULT_LIMIT = 50;

interface PluginInputs {
  search_input?: string;
  token?: string;
  jurisdiction_code?: string;
  limit?: number;
  inactive?: boolean;
}

interface OpenCorporatesAddress {
  street_address?: string | null;
  locality?: string | null;
  region?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

interface OpenCorporatesPreviousName {
  company_name?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

interface OpenCorporatesAlternativeNameObject {
  company_name?: string | null;
  name?: string | null;
}

interface OpenCorporatesIndustryCodeItem {
  industry_code?: {
    code?: string | null;
    description?: string | null;
    code_scheme_id?: string | null;
    code_scheme_name?: string | null;
    uid?: string | null;
  } | null;
}

interface OpenCorporatesSource {
  publisher?: string | null;
  url?: string | null;
  terms?: string | null;
  retrieved_at?: string | null;
}

interface OpenCorporatesCompany {
  name?: string | null;
  company_number?: string | null;
  native_company_number?: string | null;
  jurisdiction_code?: string | null;
  incorporation_date?: string | null;
  dissolution_date?: string | null;
  company_type?: string | null;
  registry_url?: string | null;
  branch?: boolean | null;
  branch_status?: string | null;
  inactive?: boolean | null;
  current_status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  retrieved_at?: string | null;
  opencorporates_url?: string | null;
  previous_names?: OpenCorporatesPreviousName[] | null;
  alternative_names?: Array<string | OpenCorporatesAlternativeNameObject> | null;
  source?: OpenCorporatesSource | null;
  registered_address?: OpenCorporatesAddress | null;
  registered_address_in_full?: string | null;
  industry_codes?: OpenCorporatesIndustryCodeItem[] | null;
}

interface OpenCorporatesOfficerCompanyRef {
  name?: string | null;
  jurisdiction_code?: string | null;
  company_number?: string | null;
  opencorporates_url?: string | null;
}

interface OpenCorporatesOfficer {
  id?: number | null;
  uid?: string | null;
  name?: string | null;
  jurisdiction_code?: string | null;
  position?: string | null;
  retrieved_at?: string | null;
  opencorporates_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  occupation?: string | null;
  current_status?: string | null;
  inactive?: boolean | null;
  address?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
  company?: OpenCorporatesOfficerCompanyRef | null;
}

interface SearchMeta {
  page?: number;
  total_pages?: number;
  total_count?: number;
}

interface CompanySearchResponse {
  results?: SearchMeta & {
    companies?: Array<{
      company?: OpenCorporatesCompany;
    }>;
  };
}

interface OfficerSearchResponse {
  results?: SearchMeta & {
    officers?: Array<{
      officer?: OpenCorporatesOfficer;
    }>;
  };
}

interface OpenCorporatesAccountStatus {
  calls_remaining?: {
    today?: number;
    this_month?: number;
  };
  usage?: {
    today?: number;
    this_month?: number;
  };
}

interface PageResult<T> {
  items: T[];
  pagesFetched: number;
  apiTotalCount?: number;
  requestedLimit: number;
}

function metricSet(name: string, value: unknown): void {
  (globalThis as any).openrisk?.metrics?.set?.(name, value);
}

function buildUsageStatus(accountStatus?: OpenCorporatesAccountStatus): string | undefined {
  const buckets = [
    {
      label: "today" as const,
      remaining: accountStatus?.calls_remaining?.today,
      usage: accountStatus?.usage?.today,
    },
    {
      label: "month" as const,
      remaining: accountStatus?.calls_remaining?.this_month,
      usage: accountStatus?.usage?.this_month,
    },
  ]
    .map((bucket) => {
      if (typeof bucket.remaining !== "number" || !Number.isFinite(bucket.remaining)) return undefined;

      const remaining = bucket.remaining;
      const usage = typeof bucket.usage === "number" && Number.isFinite(bucket.usage)
        ? bucket.usage
        : undefined;
      const total = usage !== undefined ? remaining + usage : undefined;
      const score = total && total > 0 ? remaining / total : remaining;
      const requestWord = remaining === 1 ? "request" : "requests";
      const text =
        total !== undefined && total > 0
          ? `${bucket.label} ${remaining} ${requestWord} remaining / ${total}`
          : `${bucket.label} ${remaining} ${requestWord} remaining`;

      return { score, text };
    })
    .filter((bucket): bucket is { score: number; text: string } => Boolean(bucket));

  buckets.sort((a, b) => a.score - b.score);
  return buckets[0]?.text;
}

async function refreshUsageStatus(token: string): Promise<void> {
  const url = new URL("account_status", `${OPENCORPORATES_API_URL}/`);
  url.searchParams.set("api_token", token);

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return;

    const data = (await response.json()) as { results?: { account_status?: OpenCorporatesAccountStatus } };
    const usageStatus = buildUsageStatus(data.results?.account_status);
    if (usageStatus) metricSet("status", usageStatus);
  } catch {
    // Usage status is supplemental; failures should not affect normal searches.
  }
}

function metricInc(name: string, delta = 1): void {
  (globalThis as any).openrisk?.metrics?.inc?.(name, delta);
}

export function validate(
  settings: Record<string, unknown>
): { ok: boolean; error?: string } {
  if (!settings.token || String(settings.token).trim() === "") {
    return {
      ok: false,
      error: "OpenCorporates API token is required. Please set it in plugin settings.",
    };
  }

  return { ok: true };
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const normalized = value?.trim();
    if (!normalized || seen.has(normalized)) continue;

    seen.add(normalized);
    output.push(normalized);
  }

  return output;
}

function normalizeJurisdictionCode(
  value?: string | null,
): JurisdictionIso31662Code | undefined {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || !OPENRISK_JURISDICTION_ISO_3166_2_SET.has(normalized)) {
    return undefined;
  }

  return normalized as JurisdictionIso31662Code;
}

function requireSearchInput(inputs: PluginInputs): string {
  const searchInput = inputs.search_input?.trim();
  if (!searchInput) throw new Error("search_input is required");
  return searchInput;
}

function requireToken(inputs: PluginInputs): string {
  const token = inputs.token?.trim();
  if (!token) throw new Error("token is required");
  return token;
}

function resolveLimit(limit: unknown): number {
  if (typeof limit === "number" && Number.isFinite(limit)) {
    return Math.max(1, Math.min(MAX_LIMIT, Math.floor(limit)));
  }
  return DEFAULT_LIMIT;
}

function resolvePerPage(limit: number): number {
  return Math.max(1, Math.min(50, limit));
}

function buildSearchUrl(
  path: string,
  inputs: PluginInputs,
  token: string,
  page: number,
  perPage: number,
): URL {
  const url = new URL(path, `${OPENCORPORATES_API_URL}/`);
  url.searchParams.set("q", requireSearchInput(inputs));
  url.searchParams.set("order", "score");
  url.searchParams.set("api_token", token);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const jurisdictionCode = normalizeJurisdictionCode(inputs.jurisdiction_code);
  if (jurisdictionCode) {
    url.searchParams.set("jurisdiction_code", jurisdictionCode);
  }

  if (typeof inputs.inactive === "boolean") {
    url.searchParams.set("inactive", String(inputs.inactive));
  }

  return url;
}

function sourceUrlWithoutToken(url: URL): string {
  const source = new URL(url.toString());
  source.searchParams.delete("api_token");
  return source.toString();
}

async function fetchJson<T>(url: URL): Promise<T> {
  metricInc("api_requests", 1);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  metricSet("last_status_code", response.status);

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`OpenCorporates request failed (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<T>;
}

function compactAddress(address?: OpenCorporatesAddress | null): string | undefined {
  if (!address) return undefined;

  const parts = uniqueStrings([
    address.street_address ?? undefined,
    address.locality ?? undefined,
    address.region ?? undefined,
    address.postal_code ?? undefined,
    address.country ?? undefined,
  ]);

  return parts.length ? parts.join(", ") : undefined;
}

function mapCompanyStatus(company: OpenCorporatesCompany): "active" | "inactive" | "unknown" {
  if (company.inactive === true) return "inactive";
  if (company.inactive === false) return "active";

  const status = (company.current_status ?? "").toLowerCase();
  if (status.includes("active")) return "active";
  if (
    status.includes("inactive") ||
    status.includes("dissolved") ||
    status.includes("liquidation")
  ) {
    return "inactive";
  }

  return "unknown";
}

function officerDisplayPosition(officer: OpenCorporatesOfficer): string | undefined {
  const position = officer.position?.trim();
  const companyName = officer.company?.name?.trim();

  if (position && companyName) return `${position} @ ${companyName}`;
  return position || companyName || undefined;
}

async function paginateCompanies(
  inputs: PluginInputs,
  token: string,
): Promise<PageResult<OpenCorporatesCompany>> {
  const requestedLimit = resolveLimit(inputs.limit);
  const perPage = resolvePerPage(requestedLimit);

  const items: OpenCorporatesCompany[] = [];
  let pagesFetched = 0;
  let apiTotalCount: number | undefined;

  for (let page = 1; page <= MAX_PAGES && items.length < requestedLimit; page++) {
    const url = buildSearchUrl("companies/search", inputs, token, page, perPage);
    const data = await fetchJson<CompanySearchResponse>(url);

    const rows = (data.results?.companies ?? [])
      .map((item) => item.company)
      .filter((company): company is OpenCorporatesCompany => Boolean(company));

    pagesFetched += 1;
    if (typeof data.results?.total_count === "number") {
      apiTotalCount = data.results.total_count;
    }

    if (!rows.length) break;

    for (const row of rows) {
      items.push(row);
      if (items.length >= requestedLimit) break;
    }

    const totalPages = data.results?.total_pages;
    const totalCount = data.results?.total_count;

    const hasMore =
      typeof totalPages === "number"
        ? page < totalPages
        : typeof totalCount === "number"
          ? page * perPage < totalCount
          : rows.length >= perPage;

    if (!hasMore) break;
  }

  return { items, pagesFetched, apiTotalCount, requestedLimit };
}

async function paginateOfficers(
  inputs: PluginInputs,
  token: string,
): Promise<PageResult<OpenCorporatesOfficer>> {
  const requestedLimit = resolveLimit(inputs.limit);
  const perPage = resolvePerPage(requestedLimit);

  const items: OpenCorporatesOfficer[] = [];
  let pagesFetched = 0;
  let apiTotalCount: number | undefined;

  for (let page = 1; page <= MAX_PAGES && items.length < requestedLimit; page++) {
    const url = buildSearchUrl("officers/search", inputs, token, page, perPage);
    const data = await fetchJson<OfficerSearchResponse>(url);

    const rows = (data.results?.officers ?? [])
      .map((item) => item.officer)
      .filter((officer): officer is OpenCorporatesOfficer => Boolean(officer));

    pagesFetched += 1;
    if (typeof data.results?.total_count === "number") {
      apiTotalCount = data.results.total_count;
    }

    if (!rows.length) break;

    for (const row of rows) {
      items.push(row);
      if (items.length >= requestedLimit) break;
    }

    const totalPages = data.results?.total_pages;
    const totalCount = data.results?.total_count;

    const hasMore =
      typeof totalPages === "number"
        ? page < totalPages
        : typeof totalCount === "number"
          ? page * perPage < totalCount
          : rows.length >= perPage;

    if (!hasMore) break;
  }

  return { items, pagesFetched, apiTotalCount, requestedLimit };
}

function normalizeCompanyEntity(
  company: OpenCorporatesCompany,
  sourceQueryUrl: URL,
): DataModelEntity {
  const companyName = company.name?.trim() || "Unknown company";
  const jurisdictionCode = normalizeJurisdictionCode(company.jurisdiction_code);
  const companyNumber = company.company_number?.trim();
  const nativeCompanyNumber = company.native_company_number?.trim();

  const aliases = uniqueStrings(
    (company.alternative_names ?? []).map((item) =>
      typeof item === "string" ? item : item.company_name ?? item.name ?? undefined,
    ),
  );

  const previousNames = uniqueStrings(
    (company.previous_names ?? []).map((item) => item.company_name ?? undefined),
  );

  const businessSubjects = uniqueStrings(
    (company.industry_codes ?? []).map((item) => item.industry_code?.description ?? undefined),
  ).map((description) => ({ description }));

  const extra: Record<string, string | number | boolean> = {};

  if (company.company_type) extra.company_type = company.company_type;
  if (company.current_status) extra.current_status = company.current_status;
  if (typeof company.branch === "boolean") extra.branch = company.branch;
  if (company.branch_status) extra.branch_status = company.branch_status;
  if (typeof company.inactive === "boolean") extra.inactive = company.inactive;
  if (company.created_at) extra.created_at = company.created_at;
  if (company.updated_at) extra.updated_at = company.updated_at;
  if (company.retrieved_at) extra.retrieved_at = company.retrieved_at;
  if (company.incorporation_date) extra.incorporation_date = company.incorporation_date;
  if (company.dissolution_date) extra.dissolution_date = company.dissolution_date;
  if (company.source?.publisher) extra.source_publisher = company.source.publisher;
  if (company.source?.terms) extra.source_terms = company.source.terms;
  if (company.source?.retrieved_at) extra.source_retrieved_at = company.source.retrieved_at;

  for (const [index, item] of (company.previous_names ?? []).entries()) {
    if (!item.company_name) continue;
    const n = index + 1;
    extra[`previous_name_${n}`] = item.company_name;
    if (item.start_date) extra[`previous_name_${n}_start`] = item.start_date;
    if (item.end_date) extra[`previous_name_${n}_end`] = item.end_date;
  }

  for (const [index, item] of (company.industry_codes ?? []).entries()) {
    const n = index + 1;
    if (item.industry_code?.code) extra[`industry_${n}_code`] = item.industry_code.code;
    if (item.industry_code?.description) {
      extra[`industry_${n}_description`] = item.industry_code.description;
    }
    if (item.industry_code?.code_scheme_name) {
      extra[`industry_${n}_scheme`] = item.industry_code.code_scheme_name;
    }
  }

  const registrationId = uniqueStrings([companyNumber, nativeCompanyNumber])[0];

  return buildOrganization({
    id: `opencorporates:company:${jurisdictionCode ?? "unknown"}:${companyNumber ?? nativeCompanyNumber ?? companyName.toLowerCase().replace(/\s+/g, "-")}`,
    sources: [
      {
        name: "OpenCorporates company search",
        source: sourceUrlWithoutToken(sourceQueryUrl),
      },
      ...(company.opencorporates_url
        ? [{ name: "OpenCorporates company", source: company.opencorporates_url }]
        : []),
      ...(company.registry_url ? [{ name: "Company registry", source: company.registry_url }] : []),
      ...(company.source?.url ? [{ name: "Source feed", source: company.source.url }] : []),
    ],
    payload: {
      name: companyName,
      aliases,
      previousNames,
      registrationId,
      country: company.registered_address?.country ?? undefined,
      jurisdiction: jurisdictionCode,
      address: company.registered_address_in_full?.trim() || compactAddress(company.registered_address),
      status: mapCompanyStatus(company),
      sourceRegister: company.source?.publisher ?? "OpenCorporates",
      entryTypes: company.company_type ? [company.company_type] : undefined,
      legalRoles: uniqueStrings([company.branch_status]),
      businessSubjects: businessSubjects.length ? businessSubjects : undefined,
      effectiveTo: company.dissolution_date ?? undefined,
    },
    extra,
  });
}

function normalizeOfficerEntity(
  officer: OpenCorporatesOfficer,
  sourceQueryUrl: URL,
): DataModelEntity {
  const displayPosition = officerDisplayPosition(officer);
  const officerName = officer.name?.trim() || "Unknown officer";
  const jurisdictionCode = normalizeJurisdictionCode(officer.jurisdiction_code);

  const notes = uniqueStrings([
    displayPosition,
    officer.occupation ?? undefined,
    officer.current_status ? `status: ${officer.current_status}` : undefined,
  ])[0];

  const extra: Record<string, string | number | boolean> = {};

  if (officer.id !== null && officer.id !== undefined) extra.officer_id = officer.id;
  if (officer.uid) extra.officer_uid = officer.uid;
  if (officer.position) extra.position_raw = officer.position;
  if (officer.start_date) extra.start_date = officer.start_date;
  if (officer.end_date) extra.end_date = officer.end_date;
  if (officer.current_status) extra.current_status = officer.current_status;
  if (typeof officer.inactive === "boolean") extra.inactive = officer.inactive;
  if (officer.retrieved_at) extra.retrieved_at = officer.retrieved_at;
  if (officer.company?.name) extra.company_name = officer.company.name;
  if (officer.company?.jurisdiction_code) {
    extra.company_jurisdiction_code = officer.company.jurisdiction_code;
  }
  if (officer.company?.company_number) {
    extra.company_number = officer.company.company_number;
  }

  return buildPerson({
    id: `opencorporates:officer:${officer.id ?? officer.uid ?? officerName.toLowerCase().replace(/\s+/g, "-")}`,
    sources: [
      {
        name: "OpenCorporates officer search",
        source: sourceUrlWithoutToken(sourceQueryUrl),
      },
      ...(officer.opencorporates_url
        ? [{ name: "OpenCorporates officer", source: officer.opencorporates_url }]
        : []),
      ...(officer.company?.opencorporates_url
        ? [{ name: "Officer company", source: officer.company.opencorporates_url }]
        : []),
    ],
    payload: {
      name: officerName,
      birthDate: officer.date_of_birth ?? undefined,
      nationalities: uniqueStrings([officer.nationality ?? undefined]),
      jurisdiction: jurisdictionCode,
      addresses: uniqueStrings([officer.address ?? undefined]),
      notes,
    },
    extra,
  });
}

export async function searchCompanies(inputs: PluginInputs): Promise<DataModelEntity[]> {
  const token = requireToken(inputs);
  const pageData = await paginateCompanies(inputs, token);

  const sampleUrl = buildSearchUrl(
    "companies/search",
    inputs,
    token,
    1,
    resolvePerPage(pageData.requestedLimit),
  );

  const entities = pageData.items.map((company) =>
    normalizeCompanyEntity(company, sampleUrl)
  );

  metricSet("result_count", entities.length);
  metricSet("requested_limit", pageData.requestedLimit);
  metricSet("pages_fetched", pageData.pagesFetched);
  metricSet("api_total_count", pageData.apiTotalCount ?? entities.length);
  await refreshUsageStatus(token);

  return entities;
}

export async function searchOfficers(inputs: PluginInputs): Promise<DataModelEntity[]> {
  const token = requireToken(inputs);
  const pageData = await paginateOfficers(inputs, token);

  const sampleUrl = buildSearchUrl(
    "officers/search",
    inputs,
    token,
    1,
    resolvePerPage(pageData.requestedLimit),
  );

  const entities = pageData.items.map((officer) =>
    normalizeOfficerEntity(officer, sampleUrl)
  );

  metricSet("result_count", entities.length);
  metricSet("requested_limit", pageData.requestedLimit);
  metricSet("pages_fetched", pageData.pagesFetched);
  metricSet("api_total_count", pageData.apiTotalCount ?? entities.length);
  await refreshUsageStatus(token);

  return entities;
}

export async function updateMetrics(inputs: PluginInputs): Promise<DataModelEntity[]> {
  const token = requireToken(inputs);
  await refreshUsageStatus(token);
  return [];
}
