# Hook — Pre-Mutation Inventory Gate

## Trigger
Immediately before the first repository mutation for a scope-sensitive task.

## Preconditions
Task acceptance criteria and inventory configuration are defined; repository is readable; baseline has not been altered by implementation.

## Action
Generate and persist the baseline inventory. Block mutation if required roots/classes are unresolved.

## Script/command
`python scripts/check_inventory.py <repo-root> config/inventory.json > artifacts/inventory-baseline.json`

Use a project-specific copy of `config/inventory.example.json` as `config/inventory.json`.

## Expected result
Exit `0`, `complete: true`, no missing roots, every required evidence class resolved, and a persisted `manifest_sha256`.

## Failure behavior
Exit `2`: invalid configuration/input, block. Exit `3`: incomplete evidence inventory, block and route to evidence-gap diagnosis. Do not bypass by marking a material class optional solely to continue execution.

## Blocks completion
Blocks mutation at preflight and also blocks final completion if the equivalent final inventory/reconciliation is not performed for exhaustive tasks.