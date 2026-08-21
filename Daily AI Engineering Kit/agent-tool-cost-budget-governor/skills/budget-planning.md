# Skill: Budget Planning

## Purpose
Create a bounded cost plan before an AI-assisted workflow begins so model calls, tool calls, retries, and expensive verification steps have explicit ceilings.

## When to use
Use for agent workflows that may invoke paid models, external APIs, browser/search tools, code execution, large-context reads, multi-agent delegation, or repeated retries.

## Inputs
- Task identifier and objective
- Risk level: `low`, `medium`, `high`
- Available models/tools
- Expected workflow stages
- Maximum allowed spend in the repository's configured currency
- Optional latency/token constraints

## Preconditions
- `config/cost-policy.json` exists and is valid.
- The task has a stable identifier.
- Unknown vendor pricing is represented explicitly as `unknown`; do not invent prices.

## Required context
Load only the task plan, relevant repository instructions, cost policy, and known pricing metadata. Do not scan unrelated repository content for budgeting.

## Allowed tools
Read-only repository inspection, pricing/config lookup, deterministic scripts in this package, and calculators.

## Constraints
- Budget is a safety ceiling, not a target to consume.
- Unknown cost for a paid or metered operation is treated as non-admissible unless policy explicitly permits unknown-cost operations.
- Never increase task budget without explicit human approval.
- Reserve verification budget before execution budget.

## Procedure
1. Split the task into named stages: context, plan, execute, verify, recovery.
2. Enumerate expected billable operations for each stage.
3. Assign each operation a cost class: `free`, `metered-known`, `metered-unknown`.
4. Estimate `expected_cost` and `worst_case_cost` using configured price metadata only.
5. Allocate a retry reserve according to `max_retries_per_operation`.
6. Allocate the configured minimum verification reserve before execution allocations.
7. Compute stage hard limits and the task hard limit.
8. Mark any stage requiring a high-cost model/tool or unknown pricing as approval-sensitive.
9. Write a budget plan conforming to `schemas/budget-plan.schema.json`.
10. Run `python scripts/validate_budget.py --plan <plan> --policy config/cost-policy.json`.
11. If validation passes, hand off the plan for execution admission. If not, revise once; then stop and escalate.

## Expected output
A validated budget-plan JSON containing task/stage ceilings, expected and worst-case cost, retry limits, verification reserve, approval state, and allowed cost classes.

## Verification
- Schema/semantic validation passes.
- Sum of stage hard limits does not exceed task hard limit.
- Verification reserve meets policy minimum.
- Retry counts are bounded.
- Unknown-cost operations are not silently admitted.

## Failure handling
- Invalid/missing pricing: mark operation `metered-unknown` and block or require approval per policy.
- Budget too small: propose lower-cost alternatives; do not silently increase it.
- Plan validation failure: one revision maximum, preserving validator output.

## Stop conditions
Stop when the plan validates, when required pricing remains unknown, when the budget cannot cover mandatory verification, or after one failed revision.