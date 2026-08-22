# Hook — Pre Success Gate

## Trigger
Immediately before a parent or orchestrator publishes terminal success for a task that used required delegated agents.

## Preconditions
A run record exists with parent status, required child IDs, child lifecycle records, terminal receipts, and acceptance evidence.

## Action
Invoke `scripts/reconcile_outcomes.py` with the run record and `config/policy.json`. Only `verified_success` may pass the terminal-success boundary.

## Script/command
`python3 scripts/reconcile_outcomes.py examples/run.json --policy config/policy.json`

## Expected result
Exit `0` for `verified_success`, `10` for `partial`, `20` for `reconcile`, `30` for `failed` or `blocked`, and `2` for invalid input.

## Failure behavior
Any nonzero result blocks publication of terminal success. Existing child artifacts and receipts remain preserved. `partial` and `reconcile` route to the recovery workflow rather than triggering blind rerun.

## Blocks completion
Yes. A required delegated task cannot be marked successfully complete without lifecycle and acceptance evidence.
