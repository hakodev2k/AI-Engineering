# Data Contract Rules

## Purpose
Protect producers and consumers from semantic drift, accidental breakage, and ambiguous data ownership.

## Scope
Applies to production datasets, events, files, tables, streams, platform APIs, and other data interfaces consumed across ownership boundaries.

## MUST
- Every production data contract MUST identify an owner, schema, field semantics, nullability, keys, freshness expectations, compatibility policy, and deprecation process.
- Contract changes MUST be classified as backward compatible, conditionally compatible, or breaking before release.
- Breaking changes MUST have an approved migration plan, consumer impact assessment, transition window, and verification evidence.
- Producers MUST validate emitted data against the published contract at an appropriate boundary.
- Consumers MUST define behavior for missing, late, duplicated, and newly introduced optional data where those conditions are possible.

## MUST NOT
- MUST NOT silently redefine the meaning, unit, key semantics, or cardinality of an existing field.
- MUST NOT remove or repurpose a published field without completing the contract's deprecation process.
- MUST NOT treat an implementation schema as sufficient documentation when business semantics remain ambiguous.

## SHOULD
- Prefer additive evolution and explicit versioning where compatibility cannot otherwise be preserved.
- SHOULD automate contract compatibility checks in CI for shared interfaces.

## Exceptions
Exceptions require documented consumer analysis, business justification, risk, migration or containment plan, verification, and approval from affected owners.

## Verification
Use schema compatibility checks, producer and consumer integration tests, contract registries, CI validation, migration evidence, and review of downstream dependency inventories.