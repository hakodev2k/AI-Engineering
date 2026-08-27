# Workflow: Measure and Route Subagent Fan-out

## Trigger
A plan proposes one or more subagents or an existing multi-agent run approaches its token budget.

## Goal
Choose fan-out, grouping, serial execution, or block based on measured token economics while preserving correctness.

## Inputs
Historical bootstrap samples, proposed children, inherited-context estimates, current session usage, acceptance criteria, policy.

## Baseline
Measure median bootstrap tokens/subagent, total tokens/task, latency/task, and quality/regression rate on representative work.

## Context
Only task-required context plus usage telemetry. Never remove required security or verification material to meet a budget.

## Stages
1. **Observe:** identify candidate child tasks and required independent roles.
2. **Measure baseline:** compute median bootstrap tokens from recent history.
3. **Diagnose:** identify duplicated inherited context and tiny tasks with poor useful-work ratio.
4. **Form hypothesis:** predict whether fan-out will reduce wall time enough to justify total-token increase.
5. **Route:** run `scripts/fanout_budget_guard.py` and choose `fanout`, `group`, `serial`, or `block`.
6. **Execute:** run only admitted topology; retain correctness/security checks.
7. **Measure again:** capture actual input/output/bootstrap tokens and elapsed time.
8. **Improved?** If not, revise topology at most twice.
9. **Verify:** Token Budget Reviewer compares actual vs baseline and checks quality.

## Responsible agent
Orchestrator for stages 1–8; independent Token Budget Reviewer for stage 9.

## Tools
Usage telemetry, deterministic guard, task-specific test/verification commands.

## Outputs
Baseline, topology decision, projections, actual usage, before/after comparison, verification status.

## Checkpoints
Before spawn; after each child; before retry; before consuming reserved verification budget.

## Metrics
Tokens/task, tokens/child, bootstrap tokens/child, useful-work ratio, cumulative session tokens, cost/task, latency/task, quality/regression rate.

## Retry policy
Maximum 2 topology revisions and maximum `max_retries_per_child` from policy.

## Stop conditions
Remaining budget falls below reserve; required verification cannot fit; two topology revisions fail; or quality regresses materially.

## Failure path
Stop spawning, preserve completed evidence, continue serially only if reserve and correctness constraints permit; otherwise escalate.

## Verification
Compare representative tasks before/after with equivalent acceptance tests. Token savings without equivalent quality do not count as improvement.

## Definition of Done
Baseline measured, routing decision recorded, actual usage captured, budget respected, quality verified, no blocking issue remains.
