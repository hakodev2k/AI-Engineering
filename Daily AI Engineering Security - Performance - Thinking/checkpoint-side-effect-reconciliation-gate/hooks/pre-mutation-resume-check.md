# Hook: Pre-Mutation Resume Check
## Trigger
Immediately before the first external mutation after any resume/compaction/recovery boundary.
## Preconditions
Checkpoint, durable world snapshot, side-effect ledger and policy are available.
## Action
Run `python scripts/reconcile_resume.py --checkpoint <checkpoint.json> --world <world.json> --ledger <ledger.json> --policy config/policy.json`.
## Expected result
Exit 0 and `mutation_allowed=true`.
## Failure behavior
Exit 2 indicates invalid/missing evidence; exit 3 indicates reconciliation block. Both prevent mutation and preserve reason codes.
## Blocking
Yes. This hook MUST fail closed.
