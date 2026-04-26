# Data Model 0.1.0

OpenRisk plugins return JSON arrays of **flat entities**.

```json
[
  { "...": "entity-1" },
  { "...": "entity-2" }
]
```

This version merges the common shape of the current Adversea, OpenCorporates, and OpenSanctions integrations.

## Core rules

- `$props` contains the fields the UI can render intentionally.
- `$extra` contains source-specific or low-level data that is still useful, but not part of the core card layout.
- `$props` must stay flat.
- No nested objects inside `$props`.
- No entity references inside `$props`.
- When a source exposes relationship objects such as OpenSanctions `Family`, `Employment`, `Directorship`, `Ownership`, or `Occupancy`, flatten them into string arrays on the subject entity.
  - Example: `relatives: ["Ficova Svetlana, spouse"]`
  - Example: `positions: ["Director @ Example Ltd (2020-2024)"]`
- Arrays are allowed for every prop.
- If a source has no usable value for a prop, omit it.

## Typed values

Every typed value has this shape:

```json
{
  "$type": "string",
  "value": "some value"
}
```

Supported typed values:

- `string`
- `number`
- `boolean`
- `date-iso8601`
  - full date, for example `2024-06-01`
- `date-partial-iso8601`
  - partial date, for example `2024` or `2024-06`
- `date-time-iso8601`
  - full timestamp, for example `2024-06-01T12:34:56Z`
- `url`
- `address`
- `location-iso6709`
- `image-url`
- `image-base64`
- `key-value` inside `$extra`

### `key-value`

`key-value` is used inside `$extra`.

```json
{
  "$type": "key-value",
  "value": {
    "key": {
      "$type": "string",
      "value": "someKey"
    },
    "value": {
      "$type": "string",
      "value": "someValue"
    }
  }
}
```

Rules:
- `key` is always a `string`
- `value` can be any typed value

## Entity contract

Each entity has:

- `$entity`: entity type identifier, for example `entity.person`
- `$id`: stable entity id; namespace external ids when needed, for example `opensanctions:Q7747`
- `$sources`: array of source descriptors
- `$props`: object of canonical props that the UI can render intentionally
- `$extra`: flat array of `key-value` entries for raw or unmapped data

### `$sources`

Each source entry has this shape:

```json
{
  "name": "OpenSanctions",
  "source": "https://www.opensanctions.org/entities/Q7747/"
}
```

### `$props` rules

- each prop value is always an array
- arrays allow several values for the same prop
- props are optional unless an entity definition says otherwise
- shared props should be used whenever two or more sources expose the same concept

### `$extra` rules

- `$extra` is for data that is still useful but not part of the predefined card layout
- repeated keys are allowed
- `$extra` should preserve source-specific detail that would otherwise be lost
- if a source object must be flattened, store the human-readable string in `$props` and any raw source fields in `$extra`

## Shared property groups

These groups are used across multiple entities.

### Identity

- `name`
- `aliases`
- `previousNames`
- `weakAliases`
- `abbreviation`
- `title`
- `firstName`
- `secondName`
- `middleName`
- `fatherName`
- `motherName`
- `lastName`
- `nameSuffix`
- `summary`
- `notes`
- `description`

### Geography and contact

- `country`
- `jurisdiction`
- `mainCountry`
- `address`
- `addresses`
- `emails`
- `phones`
- `website`
- `websites`
- `sourceUrl`
- `wikipediaUrl`
- `wikidataId`
- `publisher`

### Lifecycle and dates

- `birthDate`
- `birthPlace`
- `birthCountry`
- `deathDate`
- `deathPlace`
- `incorporationDate`
- `dissolutionDate`
- `listingDate`
- `effectiveFrom`
- `effectiveTo`
- `startDate`
- `endDate`
- `firstSeen`
- `lastSeen`
- `lastChange`
- `createdAt`
- `updatedAt`
- `retrievedAt`

### Identifiers

- `personId`
- `nationalId`
- `passportNumber`
- `socialSecurityNumber`
- `documentId`
- `registrationId`
- `registrationNumber`
- `companyNumber`
- `nativeCompanyNumber`
- `taxNumber`
- `vatCode`
- `licenseNumber`
- `leiCode`
- `dunsCode`
- `uniqueEntityId`
- `bvdId`
- `sayariId`
- `brightQueryId`
- `brightQueryOrgId`
- `uscCode`
- `icijId`
- `okpoCode`
- `innCode`
- `ogrnCode`
- `npiCode`
- `swiftBic`
- `voenCode`
- `coatoCode`
- `irsCode`
- `ipoCode`
- `cikCode`
- `jibCode`
- `mbsCode`
- `caemCode`
- `kppCode`
- `okvedCode`
- `okopfCode`
- `fnsCode`
- `fssCode`
- `bikCode`
- `pfrNumber`
- `oksmCode`
- `isinCode`
- `ticker`
- `ricCode`

### Classification and status

- `status`
- `legalForm`
- `companyType`
- `sector`
- `classification`
- `entryTypes`
- `legalRoles`
- `industryCodes`
- `businessActivities`
- `topics`
- `tags`

### Flattened relationships

Relationship data must be flattened into strings.

Common arrays:
- `relatives`
- `associates`
- `employers`
- `positions`
- `officers`
- `employees`
- `owners`
- `subsidiaries`
- `relatedPeople`
- `relatedOrganizations`

## `entity.person`

A physical person.

### Defined props

- `name` (`string`, required)
- `title` (`string`)
- `firstName` (`string`)
- `secondName` (`string`)
- `middleName` (`string`)
- `fatherName` (`string`)
- `motherName` (`string`)
- `lastName` (`string`)
- `nameSuffix` (`string`)
- `aliases` (`string[]`)
- `previousNames` (`string[]`)
- `weakAliases` (`string[]`)
- `birthDate` (`date-iso8601` or `date-partial-iso8601`)
- `birthPlace` (`string`)
- `birthCountry` (`string`)
- `deathDate` (`date-iso8601` or `date-partial-iso8601`)
- `deathPlace` (`string`)
- `nationality` (`string[]`)
- `citizenship` (`string[]`)
- `gender` (`string`)
- `ethnicity` (`string`)
- `religion` (`string`)
- `political` (`string`)
- `profession` (`string`)
- `education` (`string`)
- `spokenLanguage` (`string[]`)
- `position` (`string`)
- `positions` (`string[]`)
- `relatives` (`string[]`)
- `associates` (`string[]`)
- `employers` (`string[]`)
- `emails` (`string[]`)
- `phones` (`string[]`)
- `addresses` (`string[]`)
- `personId` (`string`)
- `nationalId` (`string`)
- `passportNumber` (`string`)
- `socialSecurityNumber` (`string`)
- `documentId` (`string`)
- `taxNumber` (`string`)
- `licenseNumber` (`string`)
- `country` (`string`)
- `jurisdiction` (`string`)
- `mainCountry` (`string`)
- `summary` (`string`)
- `notes` (`string`)
- `description` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)
- `wikipediaUrl` (`url`)
- `wikidataId` (`string`)
- `tags` (`string[]`)
- `topics` (`string[]`)
- `isPep` (`boolean`)
- `pepDatasets` (`string[]`)
- `pepMunicipality` (`string`)
- `pepState` (`string`)
- `isSanctioned` (`boolean`)
- `sanctionDatasets` (`string[]`)
- `sanctionDescription` (`string`)

### What belongs in `$extra`

- source-specific identifiers
- raw relation payloads
- match scores and matching metadata
- source URLs beyond the primary one
- unmerged schema-specific fields

## `entity.organization`

A legal entity, company, public body, or other organized body.

### Defined props

- `name` (`string`, required)
- `abbreviation` (`string`)
- `aliases` (`string[]`)
- `previousNames` (`string[]`)
- `weakAliases` (`string[]`)
- `registrationId` (`string`)
- `registrationNumber` (`string`)
- `companyNumber` (`string`)
- `nativeCompanyNumber` (`string`)
- `idNumber` (`string`)
- `taxNumber` (`string`)
- `licenseNumber` (`string`)
- `vatCode` (`string`)
- `leiCode` (`string`)
- `dunsCode` (`string`)
- `uniqueEntityId` (`string`)
- `bvdId` (`string`)
- `sayariId` (`string`)
- `brightQueryId` (`string`)
- `brightQueryOrgId` (`string`)
- `uscCode` (`string`)
- `icijId` (`string`)
- `okpoCode` (`string`)
- `innCode` (`string`)
- `ogrnCode` (`string`)
- `npiCode` (`string`)
- `swiftBic` (`string`)
- `voenCode` (`string`)
- `coatoCode` (`string`)
- `irsCode` (`string`)
- `ipoCode` (`string`)
- `cikCode` (`string`)
- `jibCode` (`string`)
- `mbsCode` (`string`)
- `caemCode` (`string`)
- `kppCode` (`string`)
- `okvedCode` (`string`)
- `okopfCode` (`string`)
- `fnsCode` (`string`)
- `fssCode` (`string`)
- `bikCode` (`string`)
- `pfrNumber` (`string`)
- `oksmCode` (`string`)
- `isinCode` (`string`)
- `ticker` (`string`)
- `ricCode` (`string`)
- `legalForm` (`string`)
- `companyType` (`string`)
- `sector` (`string`)
- `classification` (`string`)
- `status` (`string`)
- `branch` (`boolean`)
- `branchStatus` (`string`)
- `currentStatus` (`string`)
- `country` (`string`)
- `jurisdiction` (`string`)
- `mainCountry` (`string`)
- `incorporationDate` (`date-iso8601` or `date-partial-iso8601`)
- `dissolutionDate` (`date-iso8601` or `date-partial-iso8601`)
- `effectiveFrom` (`date-iso8601` or `date-partial-iso8601`)
- `effectiveTo` (`date-iso8601` or `date-partial-iso8601`)
- `address` (`address`)
- `addresses` (`string[]`)
- `emails` (`string[]`)
- `phones` (`string[]`)
- `website` (`url`)
- `websites` (`string[]`)
- `sourceRegister` (`string`)
- `entryTypes` (`string[]`)
- `legalRoles` (`string[]`)
- `businessActivities` (`string[]`)
- `industryCodes` (`string[]`)
- `officers` (`string[]`)
- `employees` (`string[]`)
- `owners` (`string[]`)
- `subsidiaries` (`string[]`)
- `relatedPeople` (`string[]`)
- `relatedOrganizations` (`string[]`)
- `capital` (`number`)
- `isPep` (`boolean`)
- `pepDatasets` (`string[]`)
- `isSanctioned` (`boolean`)
- `sanctionDatasets` (`string[]`)
- `sanctionDescription` (`string`)
- `summary` (`string`)
- `notes` (`string`)
- `description` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)
- `wikipediaUrl` (`url`)
- `wikidataId` (`string`)
- `tags` (`string[]`)
- `topics` (`string[]`)

### What belongs in `$extra`

- raw OpenCorporates provenance objects
- source feed metadata
- alternative company registration objects
- source-specific industry code fragments
- branch or registry detail that is too raw for the card

## `entity.address`

A location associated with an entity.

### Defined props

- `name` (`string`, required)
- `full` (`address`)
- `remarks` (`string`)
- `postOfficeBox` (`string`)
- `street` (`string`)
- `street2` (`string`)
- `city` (`string`)
- `postalCode` (`string`)
- `region` (`string`)
- `state` (`string`)
- `country` (`string`)
- `latitude` (`number`)
- `longitude` (`number`)
- `osmId` (`string`)
- `googlePlaceId` (`string`)
- `summary` (`string`)
- `notes` (`string`)
- `description` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)

## `entity.identification`

A flat identification or document record.

### Defined props

- `name` (`string`, required)
- `documentType` (`string`)
- `documentNumber` (`string`)
- `holderName` (`string`)
- `country` (`string`)
- `authority` (`string`)
- `issuedAt` (`date-iso8601` or `date-partial-iso8601`)
- `expiresAt` (`date-iso8601` or `date-partial-iso8601`)
- `status` (`string`)
- `summary` (`string`)
- `notes` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)

## `entity.sanction`

A flat sanction record.

### Defined props

- `name` (`string`, required)
- `subjectName` (`string`)
- `authority` (`string`)
- `authorityId` (`string`)
- `unscId` (`string`)
- `program` (`string`)
- `programId` (`string`)
- `programUrl` (`url`)
- `provisions` (`string`)
- `status` (`string`)
- `duration` (`number`)
- `reason` (`string`)
- `country` (`string`)
- `listingDate` (`date-iso8601` or `date-partial-iso8601`)
- `startDate` (`date-iso8601` or `date-partial-iso8601`)
- `endDate` (`date-iso8601` or `date-partial-iso8601`)
- `summary` (`string`)
- `notes` (`string`)
- `description` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)
- `recordId` (`string`)

## `entity.businessActivity`

A business subject, industry code, or activity line.

### Defined props

- `name` (`string`, required)
- `description` (`string`, required in practice)
- `code` (`string`)
- `codeSystem` (`string`)
- `sector` (`string`)
- `classification` (`string`)
- `organizationName` (`string`)
- `effectiveFrom` (`date-iso8601` or `date-partial-iso8601`)
- `effectiveTo` (`date-iso8601` or `date-partial-iso8601`)
- `sourceRegister` (`string`)
- `country` (`string`)
- `jurisdiction` (`string`)
- `summary` (`string`)
- `notes` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)

## `entity.legalCase`

A flat court or legal issue record.

### Defined props

- `name` (`string`, required)
- `courtTopic` (`string`)
- `courtDecision` (`string`)
- `court` (`string`)
- `courtId` (`string`)
- `courtMark` (`string`)
- `caseNumber` (`string`)
- `courtDecisionDate` (`date-iso8601` or `date-partial-iso8601`)
- `jurisdiction` (`string`)
- `status` (`string`)
- `parties` (`string[]`)
- `summary` (`string`)
- `notes` (`string`)
- `description` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)

## `entity.mediaMention`

One media article, search hit, or URL analysis item.

### Defined props

- `name` (`string`, required)
- `title` (`string`)
- `url` (`url`)
- `analysis` (`string`)
- `claims` (`string[]`)
- `adverseActivityDetected` (`boolean`)
- `publishedAt` (`date-iso8601` or `date-partial-iso8601`)
- `language` (`string`)
- `author` (`string`)
- `summary` (`string`)
- `notes` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)

## `entity.riskTopic`

One risk theme from an adverse-media report.

### Defined props

- `name` (`string`, required)
- `topicId` (`string`)
- `adverseActivityDetected` (`boolean`)
- `summary` (`string`)
- `notes` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)

## `entity.socialProfile`

One public social profile.

### Defined props

- `name` (`string`, required)
- `platform` (`string`)
- `profileTitle` (`string`)
- `profileUrl` (`url`)
- `userId` (`string`)
- `handle` (`string`)
- `summary` (`string`)
- `notes` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)

## `entity.financialRecord`

A debt, payment, or similar financial record.

### Defined props

- `name` (`string`, required)
- `recordType` (`string`)
- `amount` (`string`)
- `amountOwed` (`string`)
- `amountUsd` (`number`)
- `currency` (`string`)
- `location` (`address`)
- `debtSource` (`string`)
- `debtorName` (`string`)
- `creditorName` (`string`)
- `payerName` (`string`)
- `payerAccount` (`string`)
- `beneficiaryName` (`string`)
- `beneficiaryAccount` (`string`)
- `purpose` (`string`)
- `programme` (`string`)
- `sequenceNumber` (`number`)
- `transactionNumber` (`string`)
- `status` (`string`)
- `summary` (`string`)
- `notes` (`string`)
- `sourceUrl` (`url`)
- `publisher` (`string`)

## `entity.detectedEntity`

An entity discovered by extraction or matching when the exact type is unknown.

### Defined props

- `name` (`string`, required)
- `description` (`string`)
- `schema` (`string`)
- `sourceUrl` (`url`)
- `matchScore` (`number`)

## `entity.serviceAccount`

Operational account or API quota metadata.

### Defined props

- `name` (`string`, required)
- `provider` (`string`, required)
- `remainingCredit` (`number`)
- `usage` (`string`)
- `quota` (`string`)

## Source merge notes

### Adversea

- PEP / sanctions screening maps to `entity.person` or `entity.organization`
- unit analysis maps to `entity.mediaMention`
- topic report maps to `entity.riskTopic`
- social media maps to `entity.socialProfile`
- debtor checks map to `entity.financialRecord`
- RPO / business subjects map to `entity.organization` and `entity.businessActivity`
- default entity recognition maps to `entity.detectedEntity`

### OpenCorporates

- company search maps to `entity.organization`
- officer search maps to `entity.person`
- company status, previous names, incorporation dates, branch flags, and registry metadata are direct organization props
- industry codes should be flattened into `businessActivities` or `entity.businessActivity`

### OpenSanctions

- `Person`, `Organization`, `Company`, `LegalEntity`, and `PublicBody` map to the main cards above
- `Address` maps to `entity.address`
- `Sanction` maps to `entity.sanction`
- `Debt` and `Payment` map to `entity.financialRecord`
- `Document` / `Article`-style results are usually flattened into `entity.mediaMention`
- relationship schemata such as `Family`, `Employment`, `Directorship`, `Membership`, `Ownership`, `Representation`, `Occupancy`, `Associate`, and `Succession` are flattened into string arrays on the subject entity, not linked as nested entities

## Current scope

This draft defines:

- typed values
- shared entity contract
- common property groups
- `entity.person`
- `entity.organization`
- `entity.address`
- `entity.identification`
- `entity.sanction`
- `entity.businessActivity`
- `entity.legalCase`
- `entity.mediaMention`
- `entity.riskTopic`
- `entity.socialProfile`
- `entity.financialRecord`
- `entity.detectedEntity`
- `entity.serviceAccount`
