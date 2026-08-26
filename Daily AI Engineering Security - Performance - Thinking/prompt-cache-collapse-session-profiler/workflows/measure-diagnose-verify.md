# Workflow: Measure, Diagnose, Verify
## Trigger
A large session shows cost, token, or latency growth, or a cache-related client/configuration change is introduced.
## Goal
Identify sustained cache collapse, test one root-cause hypothesis at a time, and verify improvement without context-loss regression.
## Inputs
Baseline trace, candidate trace, task quality result, client/model/version/TTL/event metadata when available.
## Baseline
Record cache read/write ratios, rewritten tokens, tokens/task, latency p50/p95, and task success on comparable sessions.
## Stages
1. Observe telemetry and validate required fields.
2. Measure baseline with the profiler.
3. Diagnose collapse episodes and correlate event markers.
4. Form one explicit hypothesis.
5. Apply one reversible improvement.
6. Measure a comparable run again.
7. If metrics do not improve, revert and re-evaluate once.
8. Independently verify task quality and context sufficiency.
## Checkpoints
After baseline, before changing context behavior, after each measurement, before completion.
## Metrics
Cache-read ratio, cache-write ratio, redundant-write tokens, tokens/task, latency p50/p95, result quality and regression rate.
## Retry policy
Maximum 2 optimization iterations.
## Stop conditions
Malformed evidence, quality regression, required-context loss, or exhausted iteration budget.
## Failure path
Revert the optimization, preserve telemetry, and escalate unresolved client/provider causes.
## Verification
Profiler tests pass; before/after data shows measurable improvement and no critical quality regression.
## Definition of Done
Baseline captured, collapse status measured, hypothesis documented, before/after comparison completed, quality verified, and no blocking issue remains.
