# Clock and Time-Zone Boundary Analysis

## Purpose
Prevent AI-assisted changes from introducing date/time defects around UTC conversion, daylight-saving transitions, local business dates, scheduler boundaries, and ambiguous/invalid local times.

## When to use
Use for scheduled jobs, reminders, bookings, reports, expiry logic, audit timestamps, cross-region APIs, or any change involving `DateTime`, `DateTimeOffset`, timestamps, dates, time zones, cron, TTLs, or date-range queries.

## Inputs
- Requested behavior and business time zone.
- Relevant source files, configuration, persistence model, API contracts, and tests.
- Runtime/platform time-zone identifiers and scheduler configuration.

## Preconditions
Repository is readable; business meaning of each important timestamp can be established from code, tests, config, or requirements.

## Allowed tools
Repository search/read, build/test commands, deterministic scripts in this package, and read-only database/schema inspection.

## Constraints
Do not infer UTC/local semantics from a variable name alone. Do not alter persisted timestamp representation, public contracts, scheduler configuration, or production data without approval.

## Procedure
1. Identify every affected temporal value and classify it as instant, local date/time, date-only, duration, or schedule expression.
2. Record its source, declared type, expected zone, storage representation, serialization format, and comparison semantics.
3. Trace conversions from input through domain logic, persistence, output, and scheduling.
4. Find implicit machine-local conversions (`Now`, unspecified `DateTime`, environment local zone) and mixed-kind comparisons.
5. Determine whether DST gaps/overlaps, midnight, month/year rollover, leap day, or inclusive/exclusive bounds can affect behavior.
6. Identify existing tests and add boundary cases before changing behavior when practical.
7. Implement the smallest change that makes zone ownership explicit and keeps instants in UTC where appropriate.
8. Run `scripts/temporal_scan.py` and project tests.
9. Inspect the diff for contract/storage/scheduler changes requiring approval.
10. Produce a verification report using `schemas/verification.schema.json`.

## Expected output
A temporal inventory, evidence-backed findings, changed files, boundary tests, verification status, and unresolved risks.

## Verification
All configured checks pass; boundary cases are covered; no unapproved contract/storage/schedule change exists.

## Failure handling
Preserve command output and failing cases. Retry transient tool failures at most twice. Do not weaken assertions to obtain a pass.

## Stop conditions
Stop on unknown business time zone that changes correctness, required production mutation, schema/contract break, or two failed verification attempts.