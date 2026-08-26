# Workflow: Measure → Diagnose → Stop Safely
**Trigger:** new autonomous loop, loop regression, excessive token use, or repeated tool/approval actions.  
**Goal:** keep useful iteration while eliminating unbounded or no-progress execution.

## Inputs
Representative traces, task acceptance criteria, completion predicate, framework loop settings, `config/budget.json`.

## Baseline
Capture iterations/task, tool calls/task, tokens/task, completion rate, and repeated-signature frequency across representative successful and failed tasks.

## Context
Use observable outputs, tool calls, progress markers, and metrics. Do not request hidden chain-of-thought.

## Stages
1. **Observe** — collect normalized traces.
2. **Measure baseline** — compute task-level resource and completion distributions.
3. **Diagnose** — identify nested loop ownership and repeated signatures.
4. **Form hypothesis** — explain the no-progress condition with explicit evidence.
5. **Implement improvement** — add hard budgets and repeated-no-progress guard.
6. **Measure again** — rerun the same benchmark set.
7. **Improved?** — if no, revise the hypothesis at most twice; if yes, continue.
8. **Verify** — independent verifier checks termination and valid-task regression.

## Responsible agent
Implementation agent owns instrumentation/fix; Loop Verification Agent owns final verification.

## Tools
Trace export, `scripts/loop_budget_guard.py`, unit tests, representative benchmark runner.

## Outputs
Baseline metrics, hypothesis record, guard decisions, before/after comparison, verification decision.

## Checkpoints
After baseline; after first diagnosed repeat signature; after guard integration; after benchmark rerun.

## Metrics
Iterations/task, tool calls/task, total tokens/task, p95 tokens/task, no-progress stop rate, valid completion rate, false-stop rate.

## Retry policy
Maximum 2 hypothesis/fix revisions.

## Stop conditions
Hard budget breach, repeated no-progress threshold, invalid/unbounded policy, or two failed revisions.

## Failure path
Stop execution, return partial state and trace evidence, escalate budget changes to a human owner.

## Verification
No benchmark may run with unbounded limits. Verifier must reproduce early-stop fixtures and compare valid-task completion before/after.

## Definition of Done
Finite limits are active, repeated no-progress loops stop early, benchmark metrics are captured, valid completion regression is within accepted project threshold, and independent verification passes.