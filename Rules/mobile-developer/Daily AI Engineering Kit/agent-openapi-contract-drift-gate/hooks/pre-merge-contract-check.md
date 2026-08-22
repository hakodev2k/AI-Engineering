# Hook: Pre-Merge Contract Check

## Trigger
Before merging changes that can affect a public API contract.

## Preconditions
Baseline and candidate OpenAPI JSON files exist; Python 3 is available.

## Action
Run:
`python scripts/openapi_drift.py <baseline.json> <candidate.json> --policy config/contract-policy.json --output openapi-drift-report.json`
then:
`python scripts/validate_report.py openapi-drift-report.json`

## Expected result
Both commands exit 0 and the report contains no unapproved breaking drift.

## Failure behavior
Exit code 2 from the drift script means breaking drift and blocks merge. Any validation error also blocks. Transient execution failures may be retried at most twice; unchanged validation failures are not retryable.

## Blocking
Yes.
