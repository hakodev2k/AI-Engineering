# Workflow: Measure → Stabilize → Verify

## Trigger
Prompt-cache or uncached-input-token regression.

## Goal
Increase cache reuse by stabilizing reusable prefix structure while preserving correctness.

## Inputs
Baseline/post-change request snapshots, usage metrics, quality fixtures, `config/profile.json`.

## Baseline
At least the configured request-window size for a repeated task family. Capture input/cached tokens, latency and quality.

## Stages
1. **Observe** — confirm regression and collect representative snapshots.
2. **Measure baseline** — compute prefix fingerprints and usage metrics.
3. **Diagnose** — locate first divergent cache-intended segment.
4. **Hypothesize** — tie divergence to one construction/settings cause.
5. **Optimize** — canonicalize/order/separate static content; preserve required context.
6. **Measure again** — replay comparable workload.
7. **Improved?** — if no, one re-evaluation is allowed; maximum two total optimization attempts.
8. **Verify** — independent Cache Benchmark Verifier reproduces results.

## Responsible agent
Implementation owner optimizes; `subagents/cache-benchmark-verifier.md` verifies.

## Tools
`python3 scripts/prefix_profiler.py`, provider usage telemetry, quality test suite.

## Outputs
Baseline/post-change reports, divergence evidence, accepted/rejected decision.

## Checkpoints
Stable segments identified; no required context removed; sample counts comparable; quality gate evaluated.

## Metrics
Cached-input ratio, uncached tokens/task, prefix-change rate, latency, quality regression.

## Retry policy
Maximum 2 optimization attempts.

## Stop conditions
Stop if quality regresses beyond policy, context safety would be weakened, or reliable comparison cannot be made.

## Failure path
Restore prior prompt construction, retain evidence, and escalate unresolved provider/application cause.

## Definition of Done
Implemented, Measured and independently Verified; cache/token thresholds pass; quality does not regress; README/config match the deployed strategy.
