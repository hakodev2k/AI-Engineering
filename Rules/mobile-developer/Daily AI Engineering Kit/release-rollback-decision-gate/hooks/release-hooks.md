# Release Hooks

## PreObservation
- Trigger: release enters production observation.
- Preconditions: release ID and policy are known.
- Action: initialize evidence artifact and verify required metric names from policy can be collected.
- Command: host adapter plus `python scripts/validate-release-evidence.py ...` once evidence exists.
- Expected result: valid evidence manifest.
- Failure: retry transient collection once; otherwise block.
- Blocking: yes.

## PreDecision
- Trigger: before semantic decision analysis.
- Preconditions: valid evidence.
- Action: run deterministic gate.
- Command: `python scripts/evaluate-release-gate.py --policy config/release-policy.json --evidence release-evidence.json`
- Expected result: policy-derived status and breach list.
- Failure: block decision.
- Blocking: yes.

## PreRollbackApproval
- Trigger: recommendation becomes `rollback-recommended`.
- Preconditions: reviewer passed or escalation owner accepted the recommendation.
- Action: verify approval record exists before any external executor is invoked.
- Command: host-specific approval system; no production command is defined by this kit.
- Expected result: explicit scoped approval.
- Failure: stop.
- Blocking: yes.

## PostRollback
- Trigger: approved external rollback reports execution complete.
- Preconditions: rollback result artifact exists.
- Action: verify recovery evidence.
- Command: `python scripts/verify-rollback-result.py --policy config/release-policy.json --evidence release-evidence.json --result rollback-result.json`
- Expected result: exit 0 only when recovery criteria pass.
- Failure: keep incident/recovery open and escalate.
- Blocking: yes.

## PreComplete
- Trigger: before declaring the release gate complete.
- Action: confirm evidence validation, reviewer state, required approvals, and recovery verification when applicable.
- Failure: do not declare verified success.
- Blocking: yes.