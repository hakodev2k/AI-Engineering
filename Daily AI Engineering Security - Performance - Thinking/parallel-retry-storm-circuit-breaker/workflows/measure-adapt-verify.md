# Workflow: Measure, Adapt, Verify

## Trigger
Parallel workflow exhibits 429/5xx bursts, repeated retries, high token/call waste, or poor recovery.

## Goal
Reduce retry amplification while preserving useful parallelism and recoverable partial work.

## Inputs
Workload fixture, provider/dependency policy, event trace, concurrency, retry configuration, partial-result store.

## Baseline
Measure latency, throughput, max concurrency, requests, retries, tokens, 429/5xx rate, successful branches, preserved partial outputs, and final task completion.

## Stages
1. Observe and capture a baseline trace.
2. Diagnose correlated failures, retry delay, budgets, and lost partial work.
3. Form a single hypothesis: e.g. concurrency burst, zero-delay retry, missing global budget, or insufficient transient budget.
4. Configure/adapt circuit policy.
5. Replay identical workload.
6. If not improved, re-evaluate once with a different bounded hypothesis.
7. Compare before/after useful output per token/call and latency/throughput.
8. Benchmark Verifier independently reproduces results.

## Responsible agent
Performance Investigator for stages 1-7; Benchmark Verifier for stage 8.

## Tools
Trace/log readers, provider headers, circuit-breaker script, workload replay/benchmark harness.

## Outputs
Baseline, diagnosis, policy change, guarded trace, before/after metrics, verifier decision.

## Checkpoints
After baseline; after circuit opens/half-opens; after each replay; before completion.

## Metrics
Retry count, call count, tokens/task, wasted-token ratio, 429 rate, concurrency, useful throughput, recovery rate, latency, partial-result preservation.

## Retry policy
At most two optimization iterations. Each branch and workflow obey explicit budgets from configuration.

## Stop conditions
Global budget exhausted; dependency remains unhealthy after half-open probes; second optimization iteration fails acceptance criteria; non-retryable error dominates.

## Failure path
Stop new fan-out, preserve completed outputs, record evidence, return partial-result status or escalate according to task contract. Never hide failure by increasing limits indefinitely.

## Verification
Throttling fixture must open/reduce pressure before configured budget; zero-delay fixture must not hot-loop; healthy fixture must retain allowed parallelism; partial-result fixture must preserve completed branches.

## Definition of Done
Baseline captured, root cause supported by evidence, bounded control implemented, metrics compared, required tests pass, partial-result behavior verified, and independent verifier reports PASS.