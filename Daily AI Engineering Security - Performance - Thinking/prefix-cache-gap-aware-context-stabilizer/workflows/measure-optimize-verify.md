# Workflow — Measure, Optimize, Verify

## Trigger
High agent TTFT/cost or evidence of repeated large prefixes.

## Goal
Reduce fresh-prefill work while preserving correctness and safety.

## Inputs
Production-like telemetry, `config/policy.json`, task-quality fixtures, prompt/tool-schema builder.

## Baseline
Capture at least one representative workload before changes. Record uncached tokens/task, weighted cache hit rate, fingerprint churn, gap buckets, TTFT where available, and task pass rate.

## Stages
1. **Observe** — collect step telemetry without changing behavior.
2. **Measure baseline** — run `scripts/analyze_prefix_cache.py`.
3. **Diagnose** — classify misses as idle-gap dominated, application-prefix churn, mixed, or unknown.
4. **Form hypothesis** — name one concrete source of avoidable churn or one scheduling/cache-boundary change.
5. **Implement** — make one bounded change; never remove required safety/correctness context.
6. **Measure again** — replay the same workload.
7. **Compare** — evaluate token and TTFT deltas against policy.
8. **Verify** — independent reviewer checks regression fixtures and root-cause evidence.

## Responsible agent
Implementer owns stages 1–6. `subagents/cache-performance-reviewer.md` owns stage 8.

## Tools
Telemetry exporter, Python 3, repository diff, provider usage metadata, existing quality tests.

## Outputs
Baseline report, diagnosis, candidate diff, candidate report, independent verification record.

## Checkpoints
- Baseline exists before code change.
- Root-cause classification has evidence.
- Candidate does not weaken required context.
- Quality fixtures pass before Verified status.

## Metrics
Uncached tokens/task, weighted cache hit rate, p50/p95 TTFT, prefix churn, cost/task, task success rate.

## Retry policy
At most 2 optimization attempts per diagnosis. A failed attempt MUST return to diagnosis with new evidence.

## Stop conditions
Verified improvement; two failed attempts; insufficient telemetry; or any required-context/safety regression.

## Failure path
Preserve baseline and candidate evidence, revert the unverified optimization, document the dominant miss source, and escalate if provider/gateway behavior cannot be observed.

## Verification
Implemented = candidate change exists. Measured = comparable before/after telemetry exists. Verified = metrics improve within policy and quality fixtures pass under independent review.

## Definition of Done
Evidence documented, baseline captured, cause classified, candidate measured, regression tests pass, reviewer approves, risks recorded, and no blocking threshold violation remains.
