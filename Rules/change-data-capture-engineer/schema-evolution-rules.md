# Schema Evolution Rules

## Purpose
Prevent source schema changes from corrupting or unexpectedly stopping CDC pipelines.

## Scope
DDL, column changes, type changes, defaults, renames, generated columns, and event schemas.

## MUST
- Supported DDL operations MUST be documented and tested.
- Schema changes MUST be evaluated against capture, serialization, transport, and consumer compatibility.
- Type narrowing or semantic changes MUST require explicit migration review.
- Schema history required to decode historical events MUST be retained.
- Incompatible DDL MUST fail visibly rather than silently corrupt values.

## MUST NOT
- MUST NOT infer a rename from drop-plus-add without explicit evidence.
- MUST NOT silently coerce out-of-range values.
- MUST NOT deploy destructive DDL without a CDC compatibility and recovery plan.

## SHOULD
- Prefer expand-and-contract migrations.
- Automate schema compatibility checks in delivery pipelines.

## Exceptions
Emergency DDL requires human approval, consumer-impact assessment, and post-change validation.

## Verification
Use DDL integration tests, schema registry checks, historical decode tests, and migration reviews.