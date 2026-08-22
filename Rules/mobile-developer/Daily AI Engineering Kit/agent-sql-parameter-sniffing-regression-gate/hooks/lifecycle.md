# Lifecycle Hooks

## Pre-task validation
- **Trigger:** workflow start.
- **Preconditions:** repository root and config exist.
- **Action:** run `python scripts/verify_package.py`.
- **Expected result:** exit 0.
- **Failure:** block execution; fix missing/broken package references.

## Pre-benchmark safety
- **Trigger:** before any benchmark.
- **Preconditions:** parameter-set JSON and command template exist.
- **Action:** ensure target is non-production or explicitly read-only; run benchmark with `--dry-run` first.
- **Expected result:** command renders without secret leakage.
- **Failure:** block benchmark.

## Post-benchmark validation
- **Trigger:** benchmark completes.
- **Action:** validate result fields and compare configured thresholds.
- **Expected result:** `pass`, `warn`, or `block` with evidence.
- **Failure:** preserve raw stdout/stderr and block automated mitigation.

## Final verification
- **Trigger:** before completion.
- **Action:** Independent Verifier repeats the matrix and checks relevant code tests/build.
- **Expected result:** verified evidence plus residual risks.
- **Failure:** completion status cannot be `verified`.
