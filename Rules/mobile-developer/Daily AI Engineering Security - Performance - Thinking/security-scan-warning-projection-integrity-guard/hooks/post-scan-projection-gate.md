# Hook — Post-Scan Projection Gate

## Trigger
Immediately after required scan projections are written and before upload/archive/release-gate completion.

## Preconditions
Canonical warning JSON and all required projection files exist and are immutable for this verification attempt.

## Action
Run the deterministic warning-set comparison.

## Script/command
`python scripts/verify_warning_projection.py artifacts/canonical.json artifacts/result.sarif artifacts/bulk-receipt.json`

Adapt artifact paths to the host scanner. The first argument is always the canonical source; remaining arguments are required projections.

## Expected result
Exit `0` and JSON with `verified: true`, preservation ratio `1.0` for every required projection, and no missing warning fingerprints.

## Failure behavior
Exit `2`: malformed/unreadable evidence; block completion. Exit `3`: warning integrity failure; block projection upload/trust and retain artifacts for diagnosis.

## Blocks completion
Yes. A security projection with lost warnings must not be treated as authoritative.