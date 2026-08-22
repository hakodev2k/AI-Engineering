# Pre-Reconcile Hook

## Trigger
Before any drift investigation or reconciliation attempt.

## Preconditions
Package copied into the repository; Python 3.10+ available; inventory and policy paths selected.

## Action
1. Run `python3 scripts/verify-package.py` from the package root.
2. Validate that all inventory snapshot paths exist and are read-only inputs.
3. Run `python3 scripts/scan-config-drift.py --inventory <inventory> --policy config/drift-policy.json --output drift-report.json`.
4. Preserve the report as investigation evidence.

## Expected result
Package verification succeeds and a deterministic drift report is produced. Exit code `1` from the scanner means drift was detected and is not itself a tool failure.

## Failure behavior
- Package verifier non-zero: block execution.
- Scanner exit code `2+`: block execution and preserve stderr.
- Missing permissions/snapshot: block; do not elevate access automatically.

## Blocking
Yes, except scanner exit code `1`, which continues into investigation.
