# Workflow — Measure, Govern, Verify

## Trigger
Parallel child execution shows 429s, empty child outputs, retry bursts, or poor scaling.

## Goal
Improve useful child completion throughput by making concurrency and retry behavior model-bucket aware.

## Inputs
Baseline workload, request JSONL, current policy, model compatibility policy.

## Baseline
Run the unchanged workload at least three times or until variance is understood. Record child completion rate, total requests, 429s, retries, p50/p95 completion latency, and peak per-bucket concurrency.

## Context
Preserve required model capabilities, tool permissions, approval gates, and workload inputs across comparisons.

## Stages
1. **Observe** — Rate-Limit Investigator classifies request outcomes and quota buckets.
2. **Measure** — Run `scripts/analyze_rate_limits.py` and capture baseline JSON.
3. **Diagnose** — Select one primary hypothesis: saturation, synchronized retries, credit exhaustion, upstream outage, or telemetry defect.
4. **Form hypothesis** — Define one policy change and numeric acceptance threshold.
5. **Implement** — Add bounded admission/backpressure in the host. Keep provider SDK retry limits visible so layers do not multiply attempts.
6. **Measure again** — Repeat the identical workload.
7. **Decision** — Accept only if useful completion rate is equal/better and 429/retry amplification falls, with p95 within the configured threshold.
8. **Verify** — Independent verifier checks no forbidden fallback and no changed security boundary.

## Responsible agent
Investigator owns stages 1–4; implementation owner owns stage 5; independent verifier owns stages 6–8.

## Tools
Trace collector, analyzer script, host benchmark runner, provider metrics.

## Outputs
Baseline JSON, changed policy, comparison evidence, verification decision.

## Checkpoints
- Baseline complete before implementation.
- Quota bucket key confirmed before changing concurrency.
- Compatibility check before any fallback.
- Independent comparison before completion.

## Metrics
Completion rate, requests/completion, 429 rate, retries/completion, p50/p95 latency, max in-flight by bucket, fallback count.

## Retry policy
A logical child gets at most 3 attempts by default. A failed benchmark may trigger at most 2 policy revisions.

## Stop conditions
Stop if two bounded revisions fail acceptance, telemetry is insufficient, provider/account limit is the actual fixed bottleneck, or a proposed optimization changes required capability/security semantics.

## Failure path
Retain baseline and failed comparison, revert the policy experiment, classify the blocker, and escalate with evidence rather than increasing retries.

## Verification
The verifier must reproduce the comparison from stored traces and confirm every fallback event is policy-allowed.

## Definition of Done
Implemented, measured, and verified are separate states. Done requires all three plus documented baseline, passing acceptance metrics, bounded retry behavior, and no blocking security/capability regression.
