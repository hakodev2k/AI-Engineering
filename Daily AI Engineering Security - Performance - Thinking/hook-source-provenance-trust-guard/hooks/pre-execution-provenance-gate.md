# Hook: Pre-Execution Provenance Gate

## Trigger
Before enabling or executing hooks from a newly installed or updated source.

## Preconditions
Current hook declaration file and trusted provenance ledger exist; intended `source_id` is known.

## Action
Run source-scoped verification and block on any missing or stale record.

## Script/command
`python3 scripts/hook_provenance.py verify hooks.json trusted-ledger.json --source <source-id>`

## Expected result
Exit 0 only when the current source's exact records equal trusted records.

## Failure behavior
Exit 1 blocks execution pending review. Exit 2 blocks execution because evidence/configuration is invalid.

## Blocking
Yes.
