# Lifecycle Hooks

## Pre-task config validation
- Trigger: before agent edits configuration.
- Preconditions: policy and baseline available.
- Action: `python scripts/config_drift_gate.py --root "$REPO_ROOT" --policy config/policy.json --report .ai-config-drift-report.json`
- Expected: exit 0.
- Failure: block edits when existing drift cannot be explained.
- Blocking: yes.

## Post-edit config gate
- Trigger: after any in-scope config edit.
- Action: same gate command.
- Expected: exit 0, or an intentional breaking finding routed to approval.
- Failure: return to planner/implementation within workflow retry budget.
- Blocking: yes.

## Baseline initialization/update
- Trigger: first adoption, or approved intentional contract change only.
- Action: `python scripts/config_drift_gate.py --root "$REPO_ROOT" --policy config/policy.json --write-baseline`
- Expected: baseline files contain key paths/types only; inspect git diff immediately and re-run normal gate.
- Failure: discard unintended baseline edits and stop.
- Blocking: yes.

## Final verification
- Trigger: before completion/PR handoff.
- Action: normal gate, planned consumer build/tests, then final git diff inspection.
- Expected: all required checks pass and approval evidence exists when required.
- Failure: verifier returns blocked/inconclusive; task is not verified.
- Blocking: yes.
