# Workflow: Measure, Diagnose, Optimize

## Trigger
Slow agent run or planned performance change.

## Goal
Improve a measured bottleneck rather than optimize by intuition.

## Inputs
Representative workload, phase trace adapter, correctness check.

## Baseline
At least five comparable runs when feasible; record cold/warm state and phase p50/p95.

## Context
Use stable phase names: queue, prepare, provider_startup, orchestration, tool, business_work, completion; marks for provider_event, business_action, visible_output.

## Stages
1. **Observe** — reproduce slow behavior.
2. **Measure baseline** — validate and profile traces.
3. **Diagnose** — rank controllable phases and unattributed time.
4. **Form hypothesis** — one causal, observable change.
5. **Optimize** — implement the narrow intervention.
6. **Measure again** — same workload/environment class.
7. **Improved?** — if no, retry with new evidence; maximum two hypotheses.
8. **Verify** — Benchmark Verifier recomputes results and checks correctness.

## Responsible agent
Performance investigator through stage 7; Benchmark Verifier for stage 8.

## Tools
`phase_latency.py`, benchmark harness, runtime logs.

## Outputs
Phase breakdown, hypothesis, before/after metrics, verification result.

## Checkpoints
After trace validation, after baseline ranking, after each intervention, before final claim.

## Metrics
Target phase p50/p95, total p50/p95, TTFBA, TTFVO, unattributed ratio, correctness.

## Retry policy
Maximum two optimization attempts; failed attempt must produce new evidence before next change.

## Stop conditions
Stop if traces are invalid, workload changed, correctness regresses, or two hypotheses fail.

## Failure path
Revert unsafe/regressing optimization, preserve traces, escalate bottleneck evidence.

## Definition of Done
Baseline exists; bottleneck is attributable; post-change measurement is comparable; correctness passes; independent verifier accepts the claim.