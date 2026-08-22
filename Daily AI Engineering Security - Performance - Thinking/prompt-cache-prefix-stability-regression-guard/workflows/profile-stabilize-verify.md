# Workflow — Profile, Stabilize, Verify

## Trigger
Cache-hit degradation, higher input-token cost, increased first-token latency, or any change to prompt/tool/context assembly.

## Goal
Increase reusable prompt-prefix stability and reduce repeated input processing while preserving required context and behavior.

## Inputs
Current ordered request manifest, baseline manifest/report, cache policy, provider telemetry if available, representative workload, correctness/security fixtures.

## Baseline
Run at least three equivalent repeated tasks and capture request fingerprints, component sizes, provider cache read/write or hit/miss tokens, latency, and cost where available.

## Stages
1. **Observe** — collect request manifests and provider usage.
2. **Measure baseline** — calculate component bytes/tokens and cumulative prefix hashes.
3. **Diagnose** — locate earliest unexpected churn and largest repeated components.
4. **Form hypothesis** — choose exactly one root cause such as unstable tool ordering, timestamp placement, compaction rewrite, or static-context churn.
5. **Optimize** — apply one bounded correctness-preserving change.
6. **Measure again** — repeat the identical workload under comparable cache conditions.
7. **Improved?** — if no, re-evaluate once with a second hypothesis; after two failed attempts stop and keep baseline.
8. **Verify** — independent benchmark verifier checks cache telemetry plus quality/security fixtures.
9. **Complete** — accept only evidence-backed improvement.

## Responsible agent
Performance implementer owns stages 1–7. `subagents/cache-benchmark-verifier.md` owns final verification.

## Tools
`scripts/cache_prefix_guard.py`, provider usage logs, benchmark timer/cost calculator, task-quality tests, security regression tests.

## Outputs
Baseline/candidate reports, root-cause statement, accepted/rejected optimization, measured deltas, verification record.

## Checkpoints
- Workload comparability documented.
- Stable/volatile classification completed.
- Earliest churn point identified.
- Required context unchanged or explicitly justified.
- Provider telemetry distinguished from estimates.
- Independent verification complete.

## Metrics
Stable-prefix bytes, estimated tokens, tool-schema bytes, changed-prefix rate, cache-hit ratio, cache-miss tokens, input cost/task, p50/p95 latency, task pass rate, security pass rate.

## Retry policy
Maximum two optimization attempts per investigation. A second attempt must use a materially different evidence-backed hypothesis.

## Stop conditions
Stop on verified improvement, two failed attempts, quality/security regression, non-comparable benchmark conditions, or a proposed change that would remove required context.

## Failure path
Keep the safer baseline, document why the bottleneck remains, and escalate provider/runtime limitations when local prefix fingerprints are stable but cache telemetry remains poor.

## Verification
Independent verifier repeats deterministic report comparison and representative provider benchmark.

## Definition of Done
Baseline and candidate measured; root cause evidenced; threshold checks pass; provider-cache claims measured; quality/security fixtures pass; verifier status is `verified`; no unexplained stable-prefix churn remains.
