# Message Contract Rules

## Purpose
Protect producers and consumers from ambiguous or accidentally breaking message contracts.

## Scope
Message payloads, headers, keys, metadata, schemas, and published event/command interfaces.

## MUST
- Published messages MUST have an explicit contract covering required fields, semantics, nullability, and identifiers.
- Contract changes MUST be classified for backward and forward compatibility before release.
- Producers MUST validate required contract fields before publish.
- Consumers MUST tolerate documented compatible evolution.

## MUST NOT
- MUST NOT repurpose an existing field with incompatible meaning.
- MUST NOT remove or narrow a published field without an approved migration strategy.
- MUST NOT depend on undocumented headers or broker-specific metadata as business contract.

## SHOULD
- Prefer versioned schemas and compatibility checks in CI.

## Exceptions
Breaking changes require consumer inventory, migration plan, rollback, risk, and approval.

## Verification
Inspect schemas, compatibility reports, producer/consumer tests, and release diffs.