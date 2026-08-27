# Workflow: Measure and Migrate Prompt Caching

## Trigger
A model/provider update, cache-related request failure, unusual cache-write spend, or session-latency regression.

## Goal
Restore a compatible cache request shape and prove that caching improves or preserves cost/latency without reducing task quality.

## Inputs
Representative request metadata, current policy, recent usage telemetry, task-quality checks.

## Baseline
Record at least one representative workload window with input tokens, cache reads, cache writes, latency, retry count, and task success.

## Context
Provider/model capability docs and the rendered stable-prefix boundary.

## Stages
1. **Observe:** record the exact failure or economic anomaly.
2. **Measure baseline:** calculate read/write ratios and task metrics.
3. **Diagnose:** run `cache_guard.py`; inspect unsupported/deprecated fields and prefix mutations.
4. **Form hypothesis:** choose one root cause.
5. **Implement improvement:** modify one cache field, breakpoint, or stable-prefix boundary.
6. **Measure again:** rerun the same representative workload.
7. **Improved?** If no, revert and try one alternate hypothesis. Maximum 2 implementation attempts.
8. **Verify:** independent Cache Verifier checks compatibility, economics, and task quality.

## Responsible agent
Implementation owner performs stages 1–7; Cache Verifier performs stage 8.

## Tools
Guard script, unit tests, provider usage counters, latency telemetry, representative task suite.

## Outputs
Before/after metrics, guard result, implementation diff, verification decision.

## Checkpoints
After baseline, before any provider-facing change, after each measurement, before release.

## Metrics
Cache-read ratio, cache-write share, write/read ratio, tokens/task, cost/task, p50/p95 latency, request failures, task success.

## Retry policy
Maximum 2 implementation attempts. No automatic retry for deterministic compatibility errors.

## Stop conditions
Missing baseline; unsupported field; critical task-quality regression; telemetry contradiction; or two failed hypotheses.

## Failure path
Revert to provider-default caching with deprecated fields removed, preserve evidence, and escalate.

## Verification
The verifier must reproduce the guard outcome and independently recalculate ratios.

## Definition of Done
Compatibility passes, before/after metrics are present, task-quality checks pass, budget is met or explicitly accepted, and no blocking issue remains.
