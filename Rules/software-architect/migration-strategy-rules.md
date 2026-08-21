# Migration Strategy Rules

## Purpose
Control architectural migrations so they remain observable, reversible where possible, and safe for users and data.

## Scope
Applies to modernization, service extraction, platform replacement, database migration, framework migration, and architectural rework.

## MUST
- Major migrations MUST define target state, incremental stages, exit criteria, rollback or containment strategy, and ownership.
- Migration sequencing MUST preserve required compatibility and data integrity.
- Progress MUST be measurable using explicit milestones and operational evidence.
- Irreversible migration steps MUST require human approval and verified recovery safeguards.

## MUST NOT
- MUST NOT perform big-bang migration by default when incremental coexistence is feasible.
- MUST NOT run dual systems indefinitely without ownership and decommission criteria.
- MUST NOT declare migration complete while hidden consumers or legacy write paths remain unverified.

## SHOULD
- Prefer strangler, parallel-run, or incremental cutover patterns when they reduce risk.
- Prefer rehearsing high-risk migration steps in representative environments.

## Exceptions
A coordinated replacement may be justified for small, isolated systems when evidence shows lower total risk.

## Verification
Review migration plans, dependency inventories, compatibility tests, data reconciliation, runtime telemetry, and decommission evidence.