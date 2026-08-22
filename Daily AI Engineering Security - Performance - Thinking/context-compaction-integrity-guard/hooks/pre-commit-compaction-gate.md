# Hook — Pre-Commit Compaction Gate

## Trigger
After candidate compacted context is produced and before old context/session rotation is committed.

## Preconditions
`before.json` and `after.json` manifests exist; post-snapshot tail is attached; policy is available.

## Action
Run `python3 scripts/verify_compaction.py before.json after.json --policy config/policy.json --strict`.

## Expected result
Exit `0` with `decision=commit` and all invariants passing.

## Failure behavior
Exit `3` forces rollback/retain-original. Exit `2` indicates invalid manifest/configuration and also blocks completion.

## Blocking
Yes. Old context MUST NOT be discarded when this hook fails.
