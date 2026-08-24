# Workflow: Version Regression

## Trigger
AI CLI/runtime candidate upgrade or unexplained headless first-response slowdown.

## Goal
Measure, localize and gate first-event latency without masking failures.

## Inputs
Baseline and candidate executables, identical benchmark fixture, thresholds.

## Baseline
At least five measured samples after warmup using `scripts/measure_first_event.py`.

## Stages
1. **Observe** — record versions, environment and symptom.
2. **Measure baseline** — capture known-good JSON.
3. **Measure candidate** — unchanged fixture and timeout.
4. **Diagnose** — if blocked, distinguish process startup from AI/session initialization and test one hypothesis.
5. **Implement improvement** — upgrade/downgrade configuration or vendor-fixed version; never weaken security.
6. **Measure again** — run identical benchmark.
7. **Independent verify** — Benchmark Reviewer recomputes gates.

## Checkpoints
After baseline, after candidate comparison, after each mitigation, before rollout.

## Metrics
Median/p95 first-byte and total latency; timeout/failure rate; regression ratios.

## Retry policy
Maximum two diagnostic/mitigation iterations. Benchmark may be repeated once for invalid environmental interference, retaining both datasets.

## Stop conditions
Pass all gates; or retain/rollback candidate after two failed mitigation iterations.

## Failure path
Preserve raw results, mark rollout blocked, link upstream evidence and escalate to runtime owner.

## Definition of Done
Implemented: benchmark/gate integrated. Measured: baseline and candidate datasets exist. Verified: independent review passes and candidate meets thresholds, or rollback/block decision is recorded.
