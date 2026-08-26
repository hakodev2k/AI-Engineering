# Workflow: Diagnose and Recover

## Trigger
A run exceeds normal cost/step expectations, repeats tool calls, restarts discovery, or expands scope without closure.

## Goal
Restore forward progress or stop safely with evidence.

## Inputs
Task acceptance criteria, JSONL step trace, policy, token/cost metrics, test state.

## Baseline
Record steps/outcome, tokens/outcome, repeated-call streaks, completed/open acceptance items, retries, and verification coverage.

## Context
Use observable state only: tool signatures, progress keys, artifacts, tests, task ledger, and lifecycle events.

## Stages
1. **Observe** current trace and acceptance-state changes.
2. **Measure baseline** with `convergence_guard.py` and resource metrics.
3. **Diagnose** the dominant failure: identical action, no state change, scope growth, or lifecycle reset.
4. **Form hypothesis** naming the expected changed evidence if recovery works.
5. **Recover** by changing one causal element: input, tool, decomposition, checkpoint, or delegation boundary.
6. **Measure again** after the next bounded segment.
7. If improved, continue to verification. If not, use at most one additional recovery cycle.
8. **Verify** task completion independently or stop with clarification/escalation.

## Responsible agent
Primary implementation/planning agent for stages 1–7; Convergence Reviewer for stage 8.

## Tools
Convergence guard, task ledger, unit/integration tests, repository diff, token/cost telemetry.

## Outputs
Baseline, hypothesis, changed action, guard decisions, recovery evidence, final verification status.

## Checkpoints
Before first recovery, after each recovery segment, and before declaring completion.

## Metrics
Max identical streak, max no-progress streak, scope-growth streak, completed items/100 steps, tokens/outcome, recovery success, false-stop rate.

## Retry policy
Maximum 2 recovery cycles. A retry MUST change the hypothesis or action; byte-identical retries do not count as recovery and trigger stop.

## Stop conditions
Configured guard stop; 2 unsuccessful recovery cycles; dangerous action without approval; or evidence that completion cannot be verified.

## Failure path
Preserve artifacts and trace, stop autonomous execution, and return a self-contained clarification or escalation describing the observable blocker.

## Verification
Independent reviewer must reproduce the guard result and validate completion evidence.

## Definition of Done
The task is verified complete, or autonomous execution has stopped within bounds with a clear evidence-backed blocker; no infinite loop remains.
