# Workflow: Measure → Diagnose → Optimize → Verify
## Trigger
Cache-hit, input-cost, or TTFT regression.
## Goal
Increase reusable-prefix stability with no critical context loss.
## Inputs
Request samples, usage tokens, TTFT, quality fixtures.
## Baseline
At least 3 warm comparable requests when practical.
## Stages
1. Observe prompt assembly.
2. Measure baseline cache-read ratio, tokens/task and TTFT.
3. Diagnose earliest block drift.
4. Form a testable hypothesis.
5. Normalize ordering or move avoidable dynamic content after the cacheable prefix.
6. Measure again.
7. If not improved, revise once more.
8. Run quality/regression verification.
## Responsible agent
Token Optimizer; independent verifier for final quality pass.
## Tools
Profiler, provider telemetry, existing evaluation suite.
## Outputs
Before/after metrics and a pass/fail decision.
## Checkpoints
After baseline, after each change, after quality verification.
## Metrics
Cache ratio, token/cost per task, TTFT, stable-prefix bytes, quality score/regression count.
## Retry policy
Maximum 2 optimization iterations.
## Stop conditions
Quality regression, critical-context loss, missing evidence after telemetry repair, or exhausted iterations.
## Failure path
Revert structural optimization and document unavoidable drift.
## Verification
Improvement requires provider usage evidence plus unchanged/better task quality.
## Definition of Done
Measured improvement and no critical regression.
