# Hook — Materialization Budget Check

## Trigger
Before dispatching a batch of skill/resource fetches.

## Preconditions
Catalog/selection manifest and configured request/byte budgets exist.

## Action
Generate the fetch plan with the deterministic planner.

## Command
`python scripts/skill_materialization_planner.py --catalog catalog.json --config config/default-budget.json --output plan.json`

## Expected result
Exit `0`; plan remains within request and byte budgets and marks required entries.

## Failure behavior
Block speculative materialization. If a required skill cannot fit, surface `required_budget_exceeded` for explicit policy handling.

## Blocks completion
Yes for silent over-budget fetches or omitted required skills.
