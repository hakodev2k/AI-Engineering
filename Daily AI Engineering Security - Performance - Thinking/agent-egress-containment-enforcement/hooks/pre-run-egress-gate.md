# Hook: Pre-run Egress Gate

## Trigger
Immediately before launching an agent with any network-capable tool or subprocess.

## Preconditions
Task-scoped policy JSON exists; destination inventory is current; runtime enforcement has been configured from the same approved policy.

## Action
Run `python scripts/check_egress_policy.py <policy.json>` and store stdout/stderr with run metadata.

## Expected result
Exit 0 with `PASS` and a summary of declared destinations.

## Failure behavior
Exit 2 blocks run due to a policy violation. Exit 1 blocks run because validation could not be completed. No automatic downgrade to warning.

## Blocks completion
Yes. The run remains blocked until policy is corrected or a separately governed exception is approved and represented explicitly.