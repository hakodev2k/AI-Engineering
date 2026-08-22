# Hook: Pre-resume Consistency Check

## Trigger
Immediately before resuming an agent from a checkpoint after abnormal termination.

## Preconditions
A JSON recovery snapshot has been generated with checkpoint transition ID, pending-write transition IDs, and expected side-effect statuses.

## Action
Run the deterministic consistency checker.

## Command
`python3 scripts/recovery_consistency_check.py recovery-snapshot.json`

## Expected result
Exit 0 with decision `safe` only when transition IDs agree and every required side effect is classified as committed or not-committed according to policy.

## Failure behavior
Exit 2 means malformed evidence. Exit 3 means ambiguous or inconsistent recovery state. Both block automatic resume.

## Blocking
Yes. Failure routes to `workflows/crash-recovery-verification.md`; it MUST NOT be bypassed by changing retry or durability settings.