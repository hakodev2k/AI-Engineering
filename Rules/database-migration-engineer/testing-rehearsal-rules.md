# Testing and Rehearsal

## Purpose
Find migration failures before production data and availability are at risk.

## Scope
Covers dry runs, staging rehearsals, failure tests, performance tests, and migration automation tests.

## MUST
- High-risk migrations MUST be rehearsed with representative schema, scale, data distributions, and concurrency.
- Rehearsals MUST test failure and restart behavior, not only the happy path.
- Migration scripts MUST be version controlled and deterministically reviewable before execution.

## MUST NOT
- MUST NOT use a tiny clean dataset as sole evidence for a large heterogeneous production migration.
- MUST NOT modify an already-approved production script during execution without renewed review when behavior changes.

## SHOULD
- Capture duration, locks, throughput, resource use, errors, and validation outcomes from rehearsals.
- Rehearse operator runbooks as well as code.

## Exceptions
Low-risk bounded changes may use proportionate testing when rationale and evidence are documented.

## Verification
Review CI results, rehearsal logs, scale comparisons, failure injection, script diffs, and operator sign-off.