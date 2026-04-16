// =============================================================================
// openrisk-types.ts  ·  OpenRisk Canonical Entity Types  ·  v2
//
// Canonical model for flat OpenRisk entities.
// Plugins may inline this file, but the data model itself should stay source-agnostic.
// =============================================================================

// ---------------------------------------------------------------------------
// Wire format — must match the OpenRisk runtime DataModelEntity schema.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Shared payloads
// ---------------------------------------------------------------------------

interface EntityBasePayload {
    name: string;
    aliases?: string[];
    previousNames?: string[];
    weakAliases?: string[];
    country?: string;
    jurisdiction?: string;
    mainCountry?: string;
    status?: string;
    summary?: string;
    notes?: string;
    description?: string;
    sourceUrl?: string;
    sourceUrls?: string[];
    publisher?: string;
    website?: string;
    websites?: string[];
    emails?: string[];
    phones?: string[];
    addresses?: string[];
    wikipediaUrl?: string;
    wikidataId?: string;
    tags?: string[];
    topics?: string[];
    createdAt?: string;
    updatedAt?: string;
    retrievedAt?: string;
    firstSeen?: string;
    lastSeen?: string;
    lastChange?: string;
    effectiveFrom?: string;
    effectiveTo?: string;
    startDate?: string;
    endDate?: string;
}

interface PersonPayload extends EntityBasePayload {
    title?: string;
    firstName?: string;
    secondName?: string;
    middleName?: string;
    fatherName?: string;
    motherName?: string;
    lastName?: string;
    nameSuffix?: string;
    birthDate?: string;
    birthPlace?: string;
    birthCountry?: string;
    deathDate?: string;
    deathPlace?: string;
    nationality?: string[];
    citizenship?: string[];
    gender?: string;
    ethnicity?: string;
    religion?: string;
    political?: string;
    profession?: string;
    education?: string;
    spokenLanguage?: string[];
    position?: string;
    positions?: string[];
    employers?: string[];
    associates?: string[];
    relatives?: string[];
    personId?: string;
    nationalId?: string;
    passportNumber?: string;
    socialSecurityNumber?: string;
    documentId?: string;
    taxNumber?: string;
    licenseNumber?: string;
    isPep?: boolean;
    pepDatasets?: string[];
    pepMunicipality?: string;
    pepState?: string;
    isSanctioned?: boolean;
    sanctionDatasets?: string[];
    sanctionDescription?: string;
}

interface OrganizationPayload extends EntityBasePayload {
    abbreviation?: string;
    legalForm?: string;
    companyType?: string;
    classification?: string;
    sector?: string;
    registrationId?: string;
    registrationNumber?: string;
    companyNumber?: string;
    nativeCompanyNumber?: string;
    idNumber?: string;
    taxNumber?: string;
    licenseNumber?: string;
    vatCode?: string;
    leiCode?: string;
    dunsCode?: string;
    uniqueEntityId?: string;
    bvdId?: string;
    sayariId?: string;
    brightQueryId?: string;
    brightQueryOrgId?: string;
    uscCode?: string;
    icijId?: string;
    okpoCode?: string;
    innCode?: string;
    ogrnCode?: string;
    npiCode?: string;
    swiftBic?: string;
    voenCode?: string;
    coatoCode?: string;
    irsCode?: string;
    ipoCode?: string;
    cikCode?: string;
    jibCode?: string;
    mbsCode?: string;
    caemCode?: string;
    kppCode?: string;
    okvedCode?: string;
    okopfCode?: string;
    fnsCode?: string;
    fssCode?: string;
    bikCode?: string;
    pfrNumber?: string;
    oksmCode?: string;
    isinCode?: string;
    ticker?: string;
    ricCode?: string;
    incorporationDate?: string;
    dissolutionDate?: string;
    address?: string;
    registeredAddress?: string;
    sourceRegister?: string;
    entryTypes?: string[];
    legalRoles?: string[];
    businessActivities?: string[];
    industryCodes?: string[];
    officers?: string[];
    employees?: string[];
    owners?: string[];
    subsidiaries?: string[];
    relatedPeople?: string[];
    relatedOrganizations?: string[];
    capital?: number;
    branch?: boolean;
    branchStatus?: string;
    currentStatus?: string;
    isPep?: boolean;
    pepDatasets?: string[];
    isSanctioned?: boolean;
    sanctionDatasets?: string[];
    sanctionDescription?: string;
}

interface AddressPayload extends EntityBasePayload {
    full?: string;
    remarks?: string;
    postOfficeBox?: string;
    street?: string;
    street2?: string;
    city?: string;
    postalCode?: string;
    region?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    osmId?: string;
    googlePlaceId?: string;
}

interface IdentificationPayload extends EntityBasePayload {
    documentType?: string;
    documentNumber?: string;
    holderName?: string;
    authority?: string;
    issuedAt?: string;
    expiresAt?: string;
}

interface SanctionPayload extends EntityBasePayload {
    subjectName?: string;
    authority?: string;
    authorityId?: string;
    unscId?: string;
    program?: string;
    programId?: string;
    programUrl?: string;
    provisions?: string;
    duration?: number;
    reason?: string;
    listingDate?: string;
}

interface BusinessActivityPayload extends EntityBasePayload {
    description: string;
    code?: string;
    codeSystem?: string;
    organizationName?: string;
    sector?: string;
    classification?: string;
}

interface LegalCasePayload extends EntityBasePayload {
    courtTopic?: string;
    courtDecision?: string;
    court?: string;
    courtId?: string;
    courtMark?: string;
    caseNumber?: string;
    courtDecisionDate?: string;
    jurisdiction?: string;
    parties?: string[];
}

interface MediaMentionPayload extends EntityBasePayload {
    targetName?: string;
    title?: string;
    url?: string;
    analysisText?: string;
    claims?: string[];
    adverseActivityDetected?: boolean;
    publishedAt?: string;
    language?: string;
    author?: string;
}

interface RiskTopicPayload extends EntityBasePayload {
    targetName?: string;
    topicId?: string;
    topicName?: string;
    adverseActivityDetected?: boolean;
}

interface SocialProfilePayload extends EntityBasePayload {
    targetName?: string;
    platform?: string;
    profileTitle?: string;
    profileUrl?: string;
    userId?: string;
    handle?: string;
}

interface FinancialRecordPayload extends EntityBasePayload {
    recordType?: string;
    amount?: string;
    amountOwed?: string;
    amountUsd?: number;
    currency?: string;
    location?: string;
    debtSource?: string;
    debtorName?: string;
    creditorName?: string;
    payerName?: string;
    payerAccount?: string;
    beneficiaryName?: string;
    beneficiaryAccount?: string;
    purpose?: string;
    programme?: string;
    sequenceNumber?: number;
    transactionNumber?: string;
}

interface DetectedEntityPayload extends EntityBasePayload {
    schema?: string;
    matchScore?: number;
}

interface ServiceAccountPayload {
    name: string;
    provider: string;
    remainingCredit?: number;
    usage?: string;
    quota?: string;
}

// ---------------------------------------------------------------------------
// Builder options
// ---------------------------------------------------------------------------

interface _OR_Opts<P> {
    id: string;
    payload: P;
    sources?: Array<{ name: string; source: string }>;
    /**
     * Overflow key-value pairs that do not map to any canonical field.
     * Use sparingly — prefer extending the payload type upstream.
     */
    extra?: Record<string, string | number | boolean | null | undefined>;
}

// ---------------------------------------------------------------------------
// Internal wire helpers
// ---------------------------------------------------------------------------

const _tv = {
    str: (v: string): TypedValue<string> => ({ $type: "string", value: v }),
    num: (v: number): TypedValue<number> => ({ $type: "number", value: v }),
    bool: (v: boolean): TypedValue<boolean> => ({ $type: "boolean", value: v }),
    url: (v: string): TypedValue<string> => ({ $type: "url", value: v }),
    addr: (v: string): TypedValue<string> => ({ $type: "address", value: v }),
    imgUrl: (v: string): TypedValue<string> => ({ $type: "image-url", value: v }),
    imgB64: (v: string): TypedValue<string> => ({ $type: "image-base64", value: v }),
    date: (v: string): TypedValue<string> => ({
        $type: /^\d{4}-\d{2}-\d{2}T/.test(v) ? "date-time-iso8601"
            : /^\d{4}-\d{2}-\d{2}$/.test(v) ? "date-iso8601"
                : /^\d{4}(-\d{2})?$/.test(v) ? "date-partial-iso8601"
                    : "string",
        value: v,
    }),
};

function _or_set(props: Record<string, TypedValue[]>, key: string, val: TypedValue | undefined): void {
    if (val !== undefined) (props[key] ??= []).push(val);
}

function _or_many(props: Record<string, TypedValue[]>, key: string, vals: TypedValue[]): void {
    if (vals.length) (props[key] ??= []).push(...vals);
}

function _or_kv(key: string, val: TypedValue): _OR_KV {
    const label = key
        .replace(/[_-]+/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    return { $type: "key-value", value: { key: _tv.str(label), value: val } };
}

function _or_extra(bag?: Record<string, string | number | boolean | null | undefined>): _OR_KV[] {
    if (!bag) return [];
    return Object.entries(bag)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) =>
            _or_kv(k, typeof v === "boolean" ? _tv.bool(v)
                : typeof v === "number" ? _tv.num(v)
                    : _tv.str(String(v))),
        );
}

function _or_strs(values?: string[]): TypedValue[] {
    return (values ?? []).map(_tv.str);
}

function _or_urls(values?: string[]): TypedValue[] {
    return (values ?? []).map(_tv.url);
}

function _or_addrs(values?: string[]): TypedValue[] {
    return (values ?? []).map(_tv.addr);
}

function buildBaseProps(p: EntityBasePayload): Record<string, TypedValue[]> {
    const props: Record<string, TypedValue[]> = {};

    _or_set(props, "name", _tv.str(p.name));
    _or_many(props, "aliases", _or_strs(p.aliases));
    _or_many(props, "previousNames", _or_strs(p.previousNames));
    _or_many(props, "weakAliases", _or_strs(p.weakAliases));
    _or_set(props, "country", p.country ? _tv.str(p.country) : undefined);
    _or_set(props, "jurisdiction", p.jurisdiction ? _tv.str(p.jurisdiction) : undefined);
    _or_set(props, "mainCountry", p.mainCountry ? _tv.str(p.mainCountry) : undefined);
    _or_set(props, "status", p.status ? _tv.str(p.status) : undefined);
    _or_set(props, "summary", p.summary ? _tv.str(p.summary) : undefined);
    _or_set(props, "notes", p.notes ? _tv.str(p.notes) : undefined);
    _or_set(props, "description", p.description ? _tv.str(p.description) : undefined);
    _or_many(props, "sourceUrl", _or_urls([p.sourceUrl, ...(p.sourceUrls ?? [])].filter(Boolean) as string[]));
    _or_set(props, "publisher", p.publisher ? _tv.str(p.publisher) : undefined);
    _or_many(props, "website", _or_urls([p.website, ...(p.websites ?? [])].filter(Boolean) as string[]));
    _or_many(props, "emails", _or_strs(p.emails));
    _or_many(props, "phones", _or_strs(p.phones));
    _or_many(props, "addresses", _or_addrs(p.addresses));
    _or_set(props, "wikipediaUrl", p.wikipediaUrl ? _tv.url(p.wikipediaUrl) : undefined);
    _or_set(props, "wikidataId", p.wikidataId ? _tv.str(p.wikidataId) : undefined);
    _or_many(props, "tags", _or_strs(p.tags));
    _or_many(props, "topics", _or_strs(p.topics));
    _or_set(props, "createdAt", p.createdAt ? _tv.date(p.createdAt) : undefined);
    _or_set(props, "updatedAt", p.updatedAt ? _tv.date(p.updatedAt) : undefined);
    _or_set(props, "retrievedAt", p.retrievedAt ? _tv.date(p.retrievedAt) : undefined);
    _or_set(props, "firstSeen", p.firstSeen ? _tv.date(p.firstSeen) : undefined);
    _or_set(props, "lastSeen", p.lastSeen ? _tv.date(p.lastSeen) : undefined);
    _or_set(props, "lastChange", p.lastChange ? _tv.date(p.lastChange) : undefined);
    _or_set(props, "effectiveFrom", p.effectiveFrom ? _tv.date(p.effectiveFrom) : undefined);
    _or_set(props, "effectiveTo", p.effectiveTo ? _tv.date(p.effectiveTo) : undefined);
    _or_set(props, "startDate", p.startDate ? _tv.date(p.startDate) : undefined);
    _or_set(props, "endDate", p.endDate ? _tv.date(p.endDate) : undefined);

    return props;
}

// ---------------------------------------------------------------------------
// Entity builder functions
// ---------------------------------------------------------------------------

function buildPerson(opts: _OR_Opts<PersonPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps(p);

    _or_set(props, "title", p.title ? _tv.str(p.title) : undefined);
    _or_set(props, "firstName", p.firstName ? _tv.str(p.firstName) : undefined);
    _or_set(props, "secondName", p.secondName ? _tv.str(p.secondName) : undefined);
    _or_set(props, "middleName", p.middleName ? _tv.str(p.middleName) : undefined);
    _or_set(props, "fatherName", p.fatherName ? _tv.str(p.fatherName) : undefined);
    _or_set(props, "motherName", p.motherName ? _tv.str(p.motherName) : undefined);
    _or_set(props, "lastName", p.lastName ? _tv.str(p.lastName) : undefined);
    _or_set(props, "nameSuffix", p.nameSuffix ? _tv.str(p.nameSuffix) : undefined);
    _or_set(props, "birthDate", p.birthDate ? _tv.date(p.birthDate) : undefined);
    _or_set(props, "birthPlace", p.birthPlace ? _tv.str(p.birthPlace) : undefined);
    _or_set(props, "birthCountry", p.birthCountry ? _tv.str(p.birthCountry) : undefined);
    _or_set(props, "deathDate", p.deathDate ? _tv.date(p.deathDate) : undefined);
    _or_set(props, "deathPlace", p.deathPlace ? _tv.str(p.deathPlace) : undefined);
    _or_many(props, "nationality", _or_strs(p.nationality));
    _or_many(props, "citizenship", _or_strs(p.citizenship));
    _or_set(props, "gender", p.gender ? _tv.str(p.gender) : undefined);
    _or_set(props, "ethnicity", p.ethnicity ? _tv.str(p.ethnicity) : undefined);
    _or_set(props, "religion", p.religion ? _tv.str(p.religion) : undefined);
    _or_set(props, "political", p.political ? _tv.str(p.political) : undefined);
    _or_set(props, "profession", p.profession ? _tv.str(p.profession) : undefined);
    _or_set(props, "education", p.education ? _tv.str(p.education) : undefined);
    _or_many(props, "spokenLanguage", _or_strs(p.spokenLanguage));
    _or_set(props, "position", p.position ? _tv.str(p.position) : undefined);
    _or_many(props, "positions", _or_strs(p.positions));
    _or_many(props, "employers", _or_strs(p.employers));
    _or_many(props, "associates", _or_strs(p.associates));
    _or_many(props, "relatives", _or_strs(p.relatives));
    _or_set(props, "personId", p.personId ? _tv.str(p.personId) : undefined);
    _or_set(props, "nationalId", p.nationalId ? _tv.str(p.nationalId) : undefined);
    _or_set(props, "passportNumber", p.passportNumber ? _tv.str(p.passportNumber) : undefined);
    _or_set(props, "socialSecurityNumber", p.socialSecurityNumber ? _tv.str(p.socialSecurityNumber) : undefined);
    _or_set(props, "documentId", p.documentId ? _tv.str(p.documentId) : undefined);
    _or_set(props, "taxNumber", p.taxNumber ? _tv.str(p.taxNumber) : undefined);
    _or_set(props, "licenseNumber", p.licenseNumber ? _tv.str(p.licenseNumber) : undefined);
    _or_set(props, "isPep", p.isPep !== undefined ? _tv.bool(p.isPep) : undefined);
    _or_many(props, "pepDatasets", _or_strs(p.pepDatasets));
    _or_set(props, "pepMunicipality", p.pepMunicipality ? _tv.str(p.pepMunicipality) : undefined);
    _or_set(props, "pepState", p.pepState ? _tv.str(p.pepState) : undefined);
    _or_set(props, "isSanctioned", p.isSanctioned !== undefined ? _tv.bool(p.isSanctioned) : undefined);
    _or_many(props, "sanctionDatasets", _or_strs(p.sanctionDatasets));
    _or_set(props, "sanctionDescription", p.sanctionDescription ? _tv.str(p.sanctionDescription) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.person", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildOrganization(opts: _OR_Opts<OrganizationPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps(p);

    _or_set(props, "abbreviation", p.abbreviation ? _tv.str(p.abbreviation) : undefined);
    _or_set(props, "legalForm", p.legalForm ? _tv.str(p.legalForm) : undefined);
    _or_set(props, "companyType", p.companyType ? _tv.str(p.companyType) : undefined);
    _or_set(props, "classification", p.classification ? _tv.str(p.classification) : undefined);
    _or_set(props, "sector", p.sector ? _tv.str(p.sector) : undefined);
    _or_set(props, "registrationId", p.registrationId ? _tv.str(p.registrationId) : undefined);
    _or_set(props, "registrationNumber", p.registrationNumber ? _tv.str(p.registrationNumber) : undefined);
    _or_set(props, "companyNumber", p.companyNumber ? _tv.str(p.companyNumber) : undefined);
    _or_set(props, "nativeCompanyNumber", p.nativeCompanyNumber ? _tv.str(p.nativeCompanyNumber) : undefined);
    _or_set(props, "idNumber", p.idNumber ? _tv.str(p.idNumber) : undefined);
    _or_set(props, "taxNumber", p.taxNumber ? _tv.str(p.taxNumber) : undefined);
    _or_set(props, "licenseNumber", p.licenseNumber ? _tv.str(p.licenseNumber) : undefined);
    _or_set(props, "vatCode", p.vatCode ? _tv.str(p.vatCode) : undefined);
    _or_set(props, "leiCode", p.leiCode ? _tv.str(p.leiCode) : undefined);
    _or_set(props, "dunsCode", p.dunsCode ? _tv.str(p.dunsCode) : undefined);
    _or_set(props, "uniqueEntityId", p.uniqueEntityId ? _tv.str(p.uniqueEntityId) : undefined);
    _or_set(props, "bvdId", p.bvdId ? _tv.str(p.bvdId) : undefined);
    _or_set(props, "sayariId", p.sayariId ? _tv.str(p.sayariId) : undefined);
    _or_set(props, "brightQueryId", p.brightQueryId ? _tv.str(p.brightQueryId) : undefined);
    _or_set(props, "brightQueryOrgId", p.brightQueryOrgId ? _tv.str(p.brightQueryOrgId) : undefined);
    _or_set(props, "uscCode", p.uscCode ? _tv.str(p.uscCode) : undefined);
    _or_set(props, "icijId", p.icijId ? _tv.str(p.icijId) : undefined);
    _or_set(props, "okpoCode", p.okpoCode ? _tv.str(p.okpoCode) : undefined);
    _or_set(props, "innCode", p.innCode ? _tv.str(p.innCode) : undefined);
    _or_set(props, "ogrnCode", p.ogrnCode ? _tv.str(p.ogrnCode) : undefined);
    _or_set(props, "npiCode", p.npiCode ? _tv.str(p.npiCode) : undefined);
    _or_set(props, "swiftBic", p.swiftBic ? _tv.str(p.swiftBic) : undefined);
    _or_set(props, "voenCode", p.voenCode ? _tv.str(p.voenCode) : undefined);
    _or_set(props, "coatoCode", p.coatoCode ? _tv.str(p.coatoCode) : undefined);
    _or_set(props, "irsCode", p.irsCode ? _tv.str(p.irsCode) : undefined);
    _or_set(props, "ipoCode", p.ipoCode ? _tv.str(p.ipoCode) : undefined);
    _or_set(props, "cikCode", p.cikCode ? _tv.str(p.cikCode) : undefined);
    _or_set(props, "jibCode", p.jibCode ? _tv.str(p.jibCode) : undefined);
    _or_set(props, "mbsCode", p.mbsCode ? _tv.str(p.mbsCode) : undefined);
    _or_set(props, "caemCode", p.caemCode ? _tv.str(p.caemCode) : undefined);
    _or_set(props, "kppCode", p.kppCode ? _tv.str(p.kppCode) : undefined);
    _or_set(props, "okvedCode", p.okvedCode ? _tv.str(p.okvedCode) : undefined);
    _or_set(props, "okopfCode", p.okopfCode ? _tv.str(p.okopfCode) : undefined);
    _or_set(props, "fnsCode", p.fnsCode ? _tv.str(p.fnsCode) : undefined);
    _or_set(props, "fssCode", p.fssCode ? _tv.str(p.fssCode) : undefined);
    _or_set(props, "bikCode", p.bikCode ? _tv.str(p.bikCode) : undefined);
    _or_set(props, "pfrNumber", p.pfrNumber ? _tv.str(p.pfrNumber) : undefined);
    _or_set(props, "oksmCode", p.oksmCode ? _tv.str(p.oksmCode) : undefined);
    _or_set(props, "isinCode", p.isinCode ? _tv.str(p.isinCode) : undefined);
    _or_set(props, "ticker", p.ticker ? _tv.str(p.ticker) : undefined);
    _or_set(props, "ricCode", p.ricCode ? _tv.str(p.ricCode) : undefined);
    _or_set(props, "incorporationDate", p.incorporationDate ? _tv.date(p.incorporationDate) : undefined);
    _or_set(props, "dissolutionDate", p.dissolutionDate ? _tv.date(p.dissolutionDate) : undefined);
    _or_set(props, "address", p.address ? _tv.addr(p.address) : undefined);
    _or_set(props, "registeredAddress", p.registeredAddress ? _tv.addr(p.registeredAddress) : undefined);
    _or_set(props, "sourceRegister", p.sourceRegister ? _tv.str(p.sourceRegister) : undefined);
    _or_many(props, "entryTypes", _or_strs(p.entryTypes));
    _or_many(props, "legalRoles", _or_strs(p.legalRoles));
    _or_many(props, "businessActivities", _or_strs(p.businessActivities));
    _or_many(props, "industryCodes", _or_strs(p.industryCodes));
    _or_many(props, "officers", _or_strs(p.officers));
    _or_many(props, "employees", _or_strs(p.employees));
    _or_many(props, "owners", _or_strs(p.owners));
    _or_many(props, "subsidiaries", _or_strs(p.subsidiaries));
    _or_many(props, "relatedPeople", _or_strs(p.relatedPeople));
    _or_many(props, "relatedOrganizations", _or_strs(p.relatedOrganizations));
    _or_set(props, "capital", p.capital !== undefined ? _tv.num(p.capital) : undefined);
    _or_set(props, "branch", p.branch !== undefined ? _tv.bool(p.branch) : undefined);
    _or_set(props, "branchStatus", p.branchStatus ? _tv.str(p.branchStatus) : undefined);
    _or_set(props, "currentStatus", p.currentStatus ? _tv.str(p.currentStatus) : undefined);
    _or_set(props, "isPep", p.isPep !== undefined ? _tv.bool(p.isPep) : undefined);
    _or_many(props, "pepDatasets", _or_strs(p.pepDatasets));
    _or_set(props, "isSanctioned", p.isSanctioned !== undefined ? _tv.bool(p.isSanctioned) : undefined);
    _or_many(props, "sanctionDatasets", _or_strs(p.sanctionDatasets));
    _or_set(props, "sanctionDescription", p.sanctionDescription ? _tv.str(p.sanctionDescription) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.organization", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildAddress(opts: _OR_Opts<AddressPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps(p);

    _or_set(props, "full", p.full ? _tv.addr(p.full) : undefined);
    _or_set(props, "remarks", p.remarks ? _tv.str(p.remarks) : undefined);
    _or_set(props, "postOfficeBox", p.postOfficeBox ? _tv.str(p.postOfficeBox) : undefined);
    _or_set(props, "street", p.street ? _tv.str(p.street) : undefined);
    _or_set(props, "street2", p.street2 ? _tv.str(p.street2) : undefined);
    _or_set(props, "city", p.city ? _tv.str(p.city) : undefined);
    _or_set(props, "postalCode", p.postalCode ? _tv.str(p.postalCode) : undefined);
    _or_set(props, "region", p.region ? _tv.str(p.region) : undefined);
    _or_set(props, "state", p.state ? _tv.str(p.state) : undefined);
    _or_set(props, "latitude", p.latitude !== undefined ? _tv.num(p.latitude) : undefined);
    _or_set(props, "longitude", p.longitude !== undefined ? _tv.num(p.longitude) : undefined);
    _or_set(props, "osmId", p.osmId ? _tv.str(p.osmId) : undefined);
    _or_set(props, "googlePlaceId", p.googlePlaceId ? _tv.str(p.googlePlaceId) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.address", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildIdentification(opts: _OR_Opts<IdentificationPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps(p);

    _or_set(props, "documentType", p.documentType ? _tv.str(p.documentType) : undefined);
    _or_set(props, "documentNumber", p.documentNumber ? _tv.str(p.documentNumber) : undefined);
    _or_set(props, "holderName", p.holderName ? _tv.str(p.holderName) : undefined);
    _or_set(props, "authority", p.authority ? _tv.str(p.authority) : undefined);
    _or_set(props, "issuedAt", p.issuedAt ? _tv.date(p.issuedAt) : undefined);
    _or_set(props, "expiresAt", p.expiresAt ? _tv.date(p.expiresAt) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.identification", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildSanction(opts: _OR_Opts<SanctionPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps(p);

    _or_set(props, "subjectName", p.subjectName ? _tv.str(p.subjectName) : undefined);
    _or_set(props, "authority", p.authority ? _tv.str(p.authority) : undefined);
    _or_set(props, "authorityId", p.authorityId ? _tv.str(p.authorityId) : undefined);
    _or_set(props, "unscId", p.unscId ? _tv.str(p.unscId) : undefined);
    _or_set(props, "program", p.program ? _tv.str(p.program) : undefined);
    _or_set(props, "programId", p.programId ? _tv.str(p.programId) : undefined);
    _or_set(props, "programUrl", p.programUrl ? _tv.url(p.programUrl) : undefined);
    _or_set(props, "provisions", p.provisions ? _tv.str(p.provisions) : undefined);
    _or_set(props, "duration", p.duration !== undefined ? _tv.num(p.duration) : undefined);
    _or_set(props, "reason", p.reason ? _tv.str(p.reason) : undefined);
    _or_set(props, "listingDate", p.listingDate ? _tv.date(p.listingDate) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.sanction", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildBusinessActivity(opts: _OR_Opts<BusinessActivityPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps(p);

    _or_set(props, "description", _tv.str(p.description));
    _or_set(props, "code", p.code ? _tv.str(p.code) : undefined);
    _or_set(props, "codeSystem", p.codeSystem ? _tv.str(p.codeSystem) : undefined);
    _or_set(props, "organizationName", p.organizationName ? _tv.str(p.organizationName) : undefined);
    _or_set(props, "sector", p.sector ? _tv.str(p.sector) : undefined);
    _or_set(props, "classification", p.classification ? _tv.str(p.classification) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.businessActivity", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildLegalCase(opts: _OR_Opts<LegalCasePayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps(p);

    _or_set(props, "courtTopic", p.courtTopic ? _tv.str(p.courtTopic) : undefined);
    _or_set(props, "courtDecision", p.courtDecision ? _tv.str(p.courtDecision) : undefined);
    _or_set(props, "court", p.court ? _tv.str(p.court) : undefined);
    _or_set(props, "courtId", p.courtId ? _tv.str(p.courtId) : undefined);
    _or_set(props, "courtMark", p.courtMark ? _tv.str(p.courtMark) : undefined);
    _or_set(props, "caseNumber", p.caseNumber ? _tv.str(p.caseNumber) : undefined);
    _or_set(props, "courtDecisionDate", p.courtDecisionDate ? _tv.date(p.courtDecisionDate) : undefined);
    _or_many(props, "parties", _or_strs(p.parties));

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.legalCase", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildMediaMention(opts: _OR_Opts<MediaMentionPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps({ ...p, name: p.name ?? p.targetName ?? "Unknown mention" });

    _or_set(props, "targetName", p.targetName ? _tv.str(p.targetName) : undefined);
    _or_set(props, "title", p.title ? _tv.str(p.title) : undefined);
    _or_set(props, "url", p.url ? _tv.url(p.url) : undefined);
    _or_set(props, "analysis", p.analysisText ? _tv.str(p.analysisText) : undefined);
    _or_many(props, "claims", _or_strs(p.claims));
    _or_set(props, "adverseActivityDetected", p.adverseActivityDetected !== undefined ? _tv.bool(p.adverseActivityDetected) : undefined);
    _or_set(props, "publishedAt", p.publishedAt ? _tv.date(p.publishedAt) : undefined);
    _or_set(props, "language", p.language ? _tv.str(p.language) : undefined);
    _or_set(props, "author", p.author ? _tv.str(p.author) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.mediaMention", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildRiskTopic(opts: _OR_Opts<RiskTopicPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps({ ...p, name: p.name ?? p.targetName ?? "Unknown topic" });

    _or_set(props, "targetName", p.targetName ? _tv.str(p.targetName) : undefined);
    _or_set(props, "topicId", p.topicId ? _tv.str(p.topicId) : undefined);
    _or_set(props, "topicName", p.topicName ? _tv.str(p.topicName) : undefined);
    _or_set(props, "adverseActivityDetected", p.adverseActivityDetected !== undefined ? _tv.bool(p.adverseActivityDetected) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.riskTopic", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildSocialProfile(opts: _OR_Opts<SocialProfilePayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps({ ...p, name: p.name ?? p.targetName ?? "Unknown profile" });

    _or_set(props, "targetName", p.targetName ? _tv.str(p.targetName) : undefined);
    _or_set(props, "platform", p.platform ? _tv.str(p.platform) : undefined);
    _or_set(props, "profileTitle", p.profileTitle ? _tv.str(p.profileTitle) : undefined);
    _or_set(props, "profileUrl", p.profileUrl ? _tv.url(p.profileUrl) : undefined);
    _or_set(props, "userId", p.userId ? _tv.str(p.userId) : undefined);
    _or_set(props, "handle", p.handle ? _tv.str(p.handle) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.socialProfile", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildFinancialRecord(opts: _OR_Opts<FinancialRecordPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps(p);

    _or_set(props, "recordType", p.recordType ? _tv.str(p.recordType) : undefined);
    _or_set(props, "amount", p.amount ? _tv.str(p.amount) : undefined);
    _or_set(props, "amountOwed", p.amountOwed ? _tv.str(p.amountOwed) : undefined);
    _or_set(props, "amountUsd", p.amountUsd !== undefined ? _tv.num(p.amountUsd) : undefined);
    _or_set(props, "currency", p.currency ? _tv.str(p.currency) : undefined);
    _or_set(props, "location", p.location ? _tv.addr(p.location) : undefined);
    _or_set(props, "debtSource", p.debtSource ? _tv.str(p.debtSource) : undefined);
    _or_set(props, "debtorName", p.debtorName ? _tv.str(p.debtorName) : undefined);
    _or_set(props, "creditorName", p.creditorName ? _tv.str(p.creditorName) : undefined);
    _or_set(props, "payerName", p.payerName ? _tv.str(p.payerName) : undefined);
    _or_set(props, "payerAccount", p.payerAccount ? _tv.str(p.payerAccount) : undefined);
    _or_set(props, "beneficiaryName", p.beneficiaryName ? _tv.str(p.beneficiaryName) : undefined);
    _or_set(props, "beneficiaryAccount", p.beneficiaryAccount ? _tv.str(p.beneficiaryAccount) : undefined);
    _or_set(props, "purpose", p.purpose ? _tv.str(p.purpose) : undefined);
    _or_set(props, "programme", p.programme ? _tv.str(p.programme) : undefined);
    _or_set(props, "sequenceNumber", p.sequenceNumber !== undefined ? _tv.num(p.sequenceNumber) : undefined);
    _or_set(props, "transactionNumber", p.transactionNumber ? _tv.str(p.transactionNumber) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.financialRecord", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildDetectedEntity(opts: _OR_Opts<DetectedEntityPayload>): DataModelEntity {
    const p = opts.payload;
    const props = buildBaseProps(p);

    _or_set(props, "schema", p.schema ? _tv.str(p.schema) : undefined);
    _or_set(props, "matchScore", p.matchScore !== undefined ? _tv.num(p.matchScore) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.detectedEntity", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

function buildServiceAccount(opts: _OR_Opts<ServiceAccountPayload>): DataModelEntity {
    const p = opts.payload;
    const props: Record<string, TypedValue[]> = {};

    _or_set(props, "name", _tv.str(p.name));
    _or_set(props, "provider", _tv.str(p.provider));
    _or_set(props, "remainingCredit", p.remainingCredit !== undefined ? _tv.num(p.remainingCredit) : undefined);
    _or_set(props, "usage", p.usage ? _tv.str(p.usage) : undefined);
    _or_set(props, "quota", p.quota ? _tv.str(p.quota) : undefined);

    const extra = _or_extra(opts.extra);
    return { $entity: "entity.serviceAccount", $id: opts.id, $props: props, $extra: extra.length ? extra : undefined, $sources: opts.sources };
}

/** Slugify parts and join with ':' to form a human-readable, guaranteed-unique entity ID. */
function buildId(...parts: Array<string | number | undefined>): string {
    const slug = parts
        .filter((p): p is string | number => p !== undefined && String(p).trim().length > 0)
        .map((p) => String(p).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-_:.]+/g, "-"))
        .join(":");
    const rand = Math.random().toString(36).slice(2, 8);
    return slug ? `${slug}:${rand}` : rand;
}

// =============================================================================
// END openrisk-types.ts
// =============================================================================
