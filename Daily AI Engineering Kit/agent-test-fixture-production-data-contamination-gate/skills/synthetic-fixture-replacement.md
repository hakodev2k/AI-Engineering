# Skill: Synthetic Fixture Replacement

## Purpose
Replace unsafe production-derived values without destroying the test's ability to reproduce the target behavior.

## Inputs
Confirmed findings, relevant tests, fixture format, and required shape constraints.

## Preconditions
The behavior being reproduced is understood well enough to identify which value properties matter.

## Procedure
1. List properties actually used by code/tests: type, nullability, length, format, ordering, uniqueness, encoding, boundary value, locale, tenant relationship, or failure trigger.
2. Remove properties that are irrelevant to the assertion.
3. Generate deterministic synthetic replacements using safe reserved domains/ranges where applicable.
4. Preserve referential relationships with fake identifiers rather than copying real identifiers.
5. For secrets, replace with unmistakably non-secret literals that still satisfy parser shape when needed.
6. For recorded HTTP payloads, minimize headers/body and remove cookies, authorization, trace baggage, customer metadata, and unrelated fields.
7. Update expectations only when required by the synthetic value, not to mask behavioral regressions.
8. Run the focused test.
9. Run scanner again.
10. Inspect Git diff for accidental retention of the original value.

## Expected output
Synthetic fixture changes plus focused regression tests and a mapping from each remediated finding to its synthetic replacement strategy.

## Verification
The target test must still fail on the pre-fix behavior when such a check is feasible, pass after the fix, and scan with no unresolved blocking contamination.

## Failure handling
At most two implementation retries. If preserving the bug requires real data, isolate the minimal structural property and request human guidance rather than committing the record.

## Stop conditions
Stop before production access, secret rotation, destructive operations, schema changes, or security-control weakening.