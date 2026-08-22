# Test Data Rules
## Purpose
Keep test evidence trustworthy while protecting sensitive data.
## Scope
Test fixtures, seeded data, production-derived data, cleanup, and data lifecycle.
## MUST
- Make test data deterministic or document controlled variability.
- Protect personal, confidential, credential, and regulated data according to applicable controls.
- Ensure tests that mutate shared data have isolation and cleanup strategies.
## MUST NOT
- Copy sensitive production data into lower environments without approved masking and handling controls.
- Depend on undocumented shared records whose state can change unpredictably.
## SHOULD
- Prefer synthetic, minimal datasets that represent required business states and edge cases.
## Exceptions
Production-derived datasets require documented purpose, minimization, protection, retention, and approval.
## Verification
Inspect fixtures, environment data sources, cleanup behavior, access controls, and secret/data scans.