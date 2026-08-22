# Workflow — Measure, Stabilize, Verify

## Trigger
Tool registry change, cache-hit drop, or prompt-builder refactor.

## Goal
Improve reusable prompt-prefix stability without reducing required context or tool correctness.

## Inputs
Repeated raw tool snapshots, representative agent workload, cached-token/latency telemetry.

## Baseline
Run at least 3 equivalent builds and record raw fingerprints, cached-input ratio, uncached input tokens/task, and latency.

## Stages
1. Observe tool discovery and serialization.
2. Measure baseline fingerprint variance and runtime metrics.
3. Diagnose first ordering/schema volatility.
4. Form one bounded hypothesis.
5. Implement canonicalization or relocation of non-semantic volatile metadata.
6. Measure at least 3 equivalent builds again.
7. If not improved, re-evaluate with at most one additional hypothesis.
8. Independent verification by `subagents/cache-benchmark-verifier.md`.

## Tools
`scripts/canonicalize_tools.py`, fixture runner, provider usage telemetry.

## Outputs
Before/after fingerprint matrix, cache and latency deltas, regression results.

## Checkpoints
No claim of improvement before a representative after measurement. No required tool may disappear from the canonical output.

## Metrics
Fingerprint stability, cached-input ratio, uncached tokens/task, p50/p95 request latency, tool-availability regression.

## Retry policy
Maximum 2 hypotheses. Each retry must name a different instability source and rerun the complete benchmark.

## Stop conditions
Verified improvement; two failed hypotheses; quality regression; or volatility determined to be correctness-required.

## Failure path
Revert optimization, preserve baseline/after evidence, document unavoidable instability, escalate architecture choices.

## Definition of Done
Implemented: canonical builder is integrated. Measured: repeated before/after workload exists. Verified: independent rerun proves deterministic equivalent output and no critical correctness regression.
