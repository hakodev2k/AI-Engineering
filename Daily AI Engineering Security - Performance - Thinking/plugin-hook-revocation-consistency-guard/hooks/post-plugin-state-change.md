# Hook — Post Plugin State Change

## Trigger
Immediately after a plugin transitions to `disabled` or `removed`, or after a plugin upgrade replaces hook definitions.

## Preconditions
Desired state has been durably written; an effective runtime hook snapshot can be exported without running plugin code.

## Action
Serialize a lifecycle snapshot containing desired plugin states, active hook owners/events/handler IDs, visible inventory IDs, post-transition executions, stale failure counts, and runtime reload capability. Run:

`python3 scripts/hook_revocation_guard.py <snapshot.json> --policy config/policy.json`

## Expected result
Exit `0` only when no terminal-state plugin remains active/executed and visible/effective inventories reconcile. A restart-required state returns a non-success code and must remain visibly incomplete.

## Failure behavior
Block revocation completion. Preserve the snapshot and guard output. Perform only the bounded reconciliation described in `workflows/revoke-and-verify.md`; never silently re-enable a plugin or weaken security controls.

## Blocks completion
Yes. A plugin-state transition is not considered securely complete until this hook passes and independent verification succeeds.
