# Hook: Pre-Merge API Contract Gate

## Trigger
Before merging a change that touches API endpoints, request/response DTOs, serializers, OpenAPI configuration, routing, authorization metadata, or public contract tests.

## Preconditions
- Accepted baseline contract exists.
- Candidate contract has been generated from the code being merged.
- Python 3 is available.

## Action
Run:

`python3 scripts/compare-openapi.py --baseline artifacts/openapi-baseline.json --candidate artifacts/openapi-candidate.json --output artifacts/api-contract-report.json`

Then run relevant repository-native API tests.

## Expected result
- Comparison exits `0`.
- Report status is `pass`.
- Relevant build/tests pass.
- Independent reviewer has no unresolved compatibility concern.

## Failure behavior
- Exit `2`: block merge and mark `needs-approval`; a human must explicitly approve any intentional breaking contract.
- Exit `1`: block merge as tool/input failure.
- Test/build failure: block merge and return evidence to implementation.

## Blocking
Yes. This hook is intentionally blocking for public API compatibility failures and missing verification evidence.
