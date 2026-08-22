# Skill: Token Budget Analysis

## Purpose
Establish a measurable token baseline, attribute spend to runtime sources, and determine whether a task needs enforcement changes.

## Trigger
Use before enabling autonomous or long-running execution, after a token-spike incident, or when a task reaches 80% of its configured budget.

## Inputs
Usage ledger, task goal, model/provider, pricing assumptions, parent/child lineage, retry markers, progress checkpoints, and `config/budget-policy.json`.

## Preconditions
Usage events must be attributable to a task. Unknown usage must be reported rather than silently excluded.

## Allowed tools
Log readers, provider usage APIs, local scripts, benchmark runners, and repository inspection. Do not modify provider billing records.

## Constraints
- Do not reduce correctness-critical context solely to reduce tokens.
- Treat cached tokens separately for cost analysis but include them in repeated-work diagnostics when provider data permits.
- Never infer progress from token consumption alone.

## Procedure
1. Capture a representative baseline for at least three comparable tasks when possible.
2. Split usage by parent, subagent, retry, hook, and repair path.
3. Calculate total tokens, retry ratio, no-progress tokens, velocity, and estimated cost.
4. Identify the largest source and its triggering condition.
5. Verify whether repeated work has identical or equivalent inputs/results.
6. Define hard and warning budgets based on baseline plus justified headroom.
7. Reserve child budgets from the parent before spawning parallel work.
8. Run `scripts/budget_guard.py` against representative and adversarial ledgers.
9. Compare completion quality and failure rate before and after enforcement.

## Decision points
- If high token use corresponds to measured progress and remains inside budget, allow continuation.
- If retry ratio or no-progress tokens cross limits, stop and reconcile rather than increase the budget automatically.
- If a budget is too low for successful baseline tasks, revise it with evidence and rerun verification.

## Expected output
A baseline table, attribution breakdown, proposed thresholds, guard decision, and verification status.

## Metrics
Tokens/task, cost/task, token velocity, retry-token ratio, no-progress tokens, completion rate, quality regression rate.

## Verification
A valid solution must stop synthetic runaway ledgers, allow known-good baselines, and preserve task-quality acceptance criteria.

## Failure handling
Invalid or incomplete usage events block unattended continuation. Gather missing telemetry or require manual approval.

## Stop conditions
Stop analysis when thresholds are evidence-backed, adversarial tests pass, and no critical quality regression remains; or when required usage telemetry cannot be obtained.
