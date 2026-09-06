# Constraint Validation Rules

## Purpose
Prevent structurally valid but semantically impossible graph states.

## Scope
Cardinality, domain/range, required relationships, uniqueness, referential integrity, and business invariants.

## MUST
- Critical graph invariants MUST be expressed as deterministic validation rules where practical.
- Validation MUST distinguish blocking violations from warnings.
- Violations MUST identify affected entities, rule version, and source context.
- Schema or ontology changes MUST be tested against existing production data before enforcement.

## MUST NOT
- MUST NOT downgrade blocking constraints merely to make failing data load.
- MUST NOT accept orphaned references when graph semantics require a resolvable target.
- MUST NOT treat validation success as proof of source correctness.

## SHOULD
- Run validation both pre-ingestion and post-materialization for critical domains.
- Track recurring violation classes as quality debt.

## Exceptions
Temporary waivers require owner, scope, expiry, and remediation plan.

## Verification
Inspect constraint definitions, CI checks, validation reports, and waiver records.