# Post-Reconcile Hook

## Trigger
After an approved configuration reconciliation has been applied through the normal source-of-truth/deployment path.

## Preconditions
- Change receipt or diff exists.
- Fresh snapshots have been exported.
- Required human approval is recorded for protected actions.

## Action
1. Rerun `python3 scripts/scan-config-drift.py --inventory <inventory> --policy config/drift-policy.json --output drift-report-post.json`.
2. Run focused build/tests/runtime probes identified in the approved plan.
3. Inspect the change diff for out-of-scope files/configuration.
4. Hand evidence to `subagents/config-drift-verifier.md`.

## Expected result
Intended drift is removed or explicitly accepted, relevant checks pass, and no new unexplained high-risk drift appears.

## Failure behavior
- Scanner exit `1`: block completion until residual findings are dispositioned.
- Scanner exit `2+`: block completion as a tooling/input failure.
- Failed tests/probes: block completion and preserve evidence.
- New high-risk drift: stop and escalate; do not patch production ad hoc.

## Blocking
Yes.
