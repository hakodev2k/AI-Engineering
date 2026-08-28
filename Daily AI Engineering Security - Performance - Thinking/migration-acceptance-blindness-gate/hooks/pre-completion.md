# Hook: Pre Completion Migration Gate

## Trigger
Immediately before an agent marks a migration task complete.

## Preconditions
`migration-report.json` and `config/policy.json` exist.

## Action
Run:
`python scripts/migration_acceptance_guard.py --report migration-report.json --policy config/policy.json`

## Expected result
Exit code 0 and `"decision": "accept"`.

## Failure behavior
Exit code 3 blocks completion and routes reason codes to diagnosis. Exit code 2 blocks completion as invalid evidence.

## Blocking
Yes.
