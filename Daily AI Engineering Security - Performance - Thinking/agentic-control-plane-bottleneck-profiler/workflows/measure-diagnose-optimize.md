# Workflow: Measure, Diagnose, Optimize

## Trigger
Agent latency, cost, throughput, or tool-reliability regression; new integration; serving architecture change.

## Goal
Reduce a measured bottleneck without reducing quality, correctness, authorization, or required context.

## Inputs
Representative workload, trace spans, quality labels, deployment configuration.

## Baseline
Capture end-to-end and component metrics before code/config changes.

## Context
Agent critical paths interleave model and non-model work; do not assume the LLM is dominant.

## Stages
1. **Observe** — verify instrumentation coverage and workload representativeness.
2. **Measure baseline** — compute task p50/p95, component shares, duplicate calls, retry amplification, failures.
3. **Diagnose** — identify dominant critical-path and long-tail contributors.
4. **Form hypothesis** — choose one cause and state expected metric movement.
5. **Implement improvement** — e.g. safe dedup/cache, concurrency, timeout/retry change, sandbox pooling, placement, or model-path optimization.
6. **Measure again** — replay identical workload.
7. **Improved?** If no, re-evaluate and try once more. Maximum 2 attempts per hypothesis.
8. **Verify** — independent Benchmark Verifier checks comparability, deltas, quality, and safety.

## Responsible agents
Performance Investigator for stages 1–7; Benchmark Verifier for stage 8.

## Tools
Profiler, tracing, benchmark runner, resource metrics, application logs.

## Outputs
Baseline report, hypothesis, implementation evidence, candidate report, verification decision.

## Checkpoints
After baseline, before implementation, after each candidate replay, before release.

## Metrics
Task p50/p95; per-kind latency share; duplicate call rate; retry amplification; calls/task; failure rate; quality pass rate.

## Retry policy
Benchmark infrastructure failure: 2 retries. Optimization: 2 attempts per hypothesis. No infinite loops.

## Stop conditions
Success only with measurable improvement and preserved quality/security. Stop and revert/escalate after two failed attempts or if measurement comparability cannot be established.

## Failure path
Preserve reports, restore last known-good implementation, document rejected hypothesis, escalate instrumentation or architecture issue.

## Verification
Independent replay and comparison; no cherry-picking samples; workload and quality criteria remain fixed.

## Definition of Done
Baseline captured; bottleneck evidenced; hypothesis documented; improvement implemented; post-change measurement complete; target metric improved; quality/security floors preserved; independent verification complete; no blocking regression remains.
