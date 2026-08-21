# Hook — Pre-Release Lifecycle Gate

## Trigger
Before release/deployment of an MCP serving or SDK-lifecycle change.

## Preconditions
A benchmark JSONL exists with the configured warmup/measured volume and an explicit teardown event. Baseline p95 is available when latency regression is being evaluated.

## Action
Run:

`python3 scripts/analyze_lifecycle.py artifacts/lifecycle-after.jsonl --thresholds config/thresholds.json --baseline-p95-ms "$BASELINE_P95_MS"`

In test builds, wrap the stateless server factory with `requireFreshFactory` from `scripts/fresh_factory_guard.mjs`.

## Expected result
Analyzer exits `0` with `decision=pass`, duplicate server identities `0`, acceptable heap slope/error/latency, and `clean_teardown=true`.

## Failure behavior
Exit `2` means invalid evidence/config; exit `3` means a measured regression. Both block release. Preserve the report and raw JSONL. Do not automatically raise thresholds or remove fresh-factory enforcement.

## Blocks completion
Yes. The gate may be bypassed only through an explicit human-approved exception that documents why the target deployment has a different lifecycle contract and includes equivalent regression evidence.