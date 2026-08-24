# Workflow: Measure, Diagnose, and Verify Agent Latency Attribution

## Trigger
A tool or agent step appears slow, an approval-gated duration is cited in a technical decision, or timing instrumentation changes.

## Goal
Determine which lifecycle phase is actually slow, optimize only the evidenced bottleneck, and prove the result with comparable before/after measurements.

## Inputs
Correlated phase traces, representative workload, approval policy, profiler script, tests, and any proposed implementation change.

## Baseline
Collect a representative sample and record p50/p95 for tool execution, approval wait, continuation, and total wall-clock separately.

## Context
Follow `skills/phase-latency-analysis.md` and `rules/timing-attribution.md`.

## Stages
1. **Observe** — capture trace events and identify whether approval occurred.
2. **Measure baseline** — profile each call; reject invalid phase ordering.
3. **Diagnose** — assign delay to approval, execution, continuation, or unattributed time.
4. **Form hypothesis** — state one measurable cause tied to one phase.
5. **Optimize** — change only the evidenced phase; preserve security/approval boundaries.
6. **Measure again** — replay comparable workload and approval policy.
7. **Improved?** — if execution metric did not improve, collect one new diagnostic signal and retry; maximum two optimization attempts.
8. **Verify** — independent verifier checks attribution and comparability.
9. **Complete** — report Implemented, Measured, and Verified separately.

## Responsible agent
Performance investigator owns stages 1–7. `subagents/performance-verifier.md` owns stage 8.

## Tools
Trace/log collection, `scripts/latency_attribution.py`, unit tests, existing benchmark/observability tooling.

## Outputs
Baseline metrics, diagnosis, hypothesis, implementation delta, post-change metrics, independent verdict.

## Checkpoints
- CP1: approval and execution phases are distinguishable.
- CP2: baseline captured before optimization.
- CP3: hypothesis names the correct phase.
- CP4: approval controls remain intact.
- CP5: verifier confirms the metric supports the claim.

## Metrics
`approval_wait_ms`, `tool_execution_ms`, `continuation_ms`, `wall_clock_ms`, `unattributed_ms`, execution p50/p95, misattribution count.

## Retry policy
Maximum two optimization attempts. A retry requires new evidence; repeating the same benchmark without a changed hypothesis does not count as progress.

## Stop conditions
Stop when phase correlation is invalid, baseline is unavailable, samples are not comparable, retry limit is reached, or a proposed optimization weakens required approval/security controls.

## Failure path
Revert the optimization, preserve the trace and profiler evidence, and escalate the instrumentation or backend bottleneck with the exact unresolved phase.

## Verification
Run unit tests and compare execution-only before/after metrics. Approval wait may vary independently and must not be used to claim tool speedup.

## Definition of Done
Baseline captured; phase boundaries valid; bottleneck identified; optimization implemented only if evidenced; comparable measurement repeated; tests pass; security boundaries preserved; independent verifier approves; no unsupported latency claim remains.
