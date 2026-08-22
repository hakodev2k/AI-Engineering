# Test Data Rules

## Purpose
Keep automated test data safe, traceable, representative, and independently manageable.

## Scope
Applies to generated fixtures, seeded records, accounts, files, synthetic datasets, and copied production-like data.

## MUST
- Test data MUST have explicit ownership, lifecycle, and uniqueness requirements.
- Sensitive or production-derived data MUST be sanitized according to security and privacy requirements before test use.
- Data builders MUST expose business-significant differences rather than hiding them behind opaque defaults.
- Cleanup MUST target only resources owned by the test or suite.

## MUST NOT
- MUST NOT embed real credentials, secrets, personal data, or regulated production records in test assets.
- MUST NOT delete broadly by weak patterns that can affect unrelated environment data.
- MUST NOT rely indefinitely on shared manually maintained records for critical regression coverage.

## SHOULD
- Prefer generated minimal datasets with explicit scenario intent.
- Prefer stable reference data only for genuinely immutable domain concepts.

## Exceptions
Shared datasets require documented ownership, mutation policy, reset process, and concurrency controls.

## Verification
Inspect fixtures, cleanup queries, generated identifiers, repository history, secret scanning, and parallel-run behavior.