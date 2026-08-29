# Interface Contract Rules

## Purpose
Protect integration boundaries from ambiguous, accidental, or incompatible behavior.

## Scope
Applies to APIs, files, events, queues, schemas, protocols, and shared integration contracts.

## MUST
- Every integration boundary MUST have a versioned or otherwise identifiable contract with defined request, response, field, error, and semantic behavior.
- Required versus optional data MUST be explicit.
- Nullability, units, time zones, identifier semantics, ordering guarantees, and cardinality MUST be defined when applicable.
- Contract changes MUST be classified as backward-compatible or breaking before release.
- Breaking changes MUST require coordinated migration and explicit approval.

## MUST NOT
- MUST NOT silently repurpose an existing field or status value.
- MUST NOT depend on undocumented consumer behavior.
- MUST NOT remove or narrow accepted behavior without compatibility analysis.

## SHOULD
- Machine-readable schemas SHOULD be used where supported.
- Contracts SHOULD define examples for edge cases as well as happy paths.

## Exceptions
An exception MUST document affected consumers, compatibility risk, migration plan, evidence, and owner approval.

## Verification
Use schema validation, contract tests, consumer compatibility tests, API diff tools, and manual review of semantic changes.