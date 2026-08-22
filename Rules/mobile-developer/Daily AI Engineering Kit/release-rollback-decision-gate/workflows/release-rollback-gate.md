# Release Rollback Gate Workflow

## Trigger
A production release, canary, traffic shift, feature activation, infrastructure change, or release-related alert enters its observation phase.

## Entry conditions
- Release identity is known.
- Policy exists.
- Read-only monitoring evidence can be collected.

## Inputs
Release metadata, policy, metric samples, baseline, alerts/incidents, smoke/integration tests, business/data-integrity signals.

## Context
Only load evidence relevant to the changed component and release window. Expand context when a competing cause requires investigation.

## Stages

### 1. Collect evidence — owner: Signal Collector / host adapter
Produce `release-evidence.json`.
Checkpoint: required metric sources are reachable.
Failure: retry transient reads once; then `blocked`.

### 2. Validate evidence — owner: deterministic script
Run:
`python scripts/validate-release-evidence.py --policy config/release-policy.json --evidence release-evidence.json`
Checkpoint: exit 0.
Failure: correct manifest; validation failures are not bypassed.

### 3. Evaluate thresholds — owner: deterministic script
Run:
`python scripts/evaluate-release-gate.py --policy config/release-policy.json --evidence release-evidence.json`
Artifact: machine-readable/stdout gate result.

### 4. Analyze decision — owner: Decision Analyst
Classify facts/hypotheses and recommend `healthy`, `observe`, `rollback-recommended`, or `blocked`.
Checkpoint: recommendation respects policy observation deadline.

### 5. Independent review — owner: Rollback Reviewer
Return `pass`, `revise`, or `blocked`.
Retry loop: at most two evidence/reasoning revisions. Preserve prior findings. If disagreement persists, stop and escalate.

### 6. Decision gate
- `healthy`: continue normal release completion.
- `observe`: collect only the evidence required for the next decision point. Do not exceed `max_observation_minutes`.
- `rollback-recommended`: STOP and request human approval.
- `blocked`: STOP and escalate missing/invalid evidence.

### 7. Approval boundary
Production rollback or any equivalent production mutation requires explicit human approval. The approval record must identify release ID, decision, approver, timestamp, and approved action scope.

### 8. External rollback
Execution is intentionally outside this kit. Preserve deployment logs and resulting version/state.

### 9. Verify recovery
Populate `rollback-result.json` and run:
`python scripts/verify-rollback-result.py --policy config/release-policy.json --evidence release-evidence.json --result rollback-result.json`
A rollback is not verified solely because deployment tooling reported success.

## Failure paths
- Monitoring/tool transient error: retry once.
- Evidence/schema failure: stop until corrected.
- Permission failure: stop; do not elevate permissions.
- Reviewer disagreement: max two revisions then human escalation.
- Rollback execution failure: no automated retry in this kit; preserve evidence and escalate immediately.
- Verification failure: remain in incident/recovery state; do not declare success.

## Definition of Done
Release evidence is valid; decision is reproducible from policy; reviewer passed or human owner resolved disagreement; approvals exist for any production mutation; and post-rollback recovery verification passed when rollback occurred.