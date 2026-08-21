# Hook — Pre Retry

## Trigger
Immediately before retrying any side-effecting tool call after an error, timeout, disconnect, missing-handler response, or lost continuation.

## Preconditions
A ledger record exists for the logical operation key.

## Action
Run:
```bash
python scripts/side_effect_ledger.py retry-check --file .agent-state/side-effects.json --key "$OPERATION_KEY"
```

## Expected result
Exit `0`: retry is explicitly eligible (`confirmed-not-applied` or integration-approved idempotent replay).

Exit `2`: retry blocked because operation is applied, duplicated, dispatched, or unknown.

Exit `3`: ledger/config/evidence error; retry blocked.

## Failure behavior
Perform read-only reconciliation through `workflows/mutate-confirm-reconcile.md`. Never bypass this hook by generating a new operation key.

## Blocking
Yes. Any non-zero status blocks an automatic mutation retry.