# Incident Command Checklist

## Declare
- [ ] Incident ID and title exist.
- [ ] Started-at timestamp includes timezone.
- [ ] Incident Commander is named.
- [ ] Provisional severity is recorded with impact evidence.
- [ ] Authoritative incident state/channel is identified.
- [ ] Next synchronization checkpoint is scheduled.

## Triage
- [ ] User/business impact is bounded as far as current evidence permits.
- [ ] Security and data-integrity implications are explicitly considered.
- [ ] Facts are separated from hypotheses, assumptions, and unknowns.
- [ ] Recent deployments/configuration/database/infrastructure/dependency changes are recorded.
- [ ] Critical observability blind spots have owners.
- [ ] Immediate safety constraints are recorded.

## Organize response
- [ ] Every critical workstream has one accountable owner.
- [ ] Each task has a goal, expected output, state, dependency, and checkpoint.
- [ ] Independent investigations run in parallel where useful.
- [ ] Dependent tasks are not falsely parallelized.
- [ ] Duplicate investigations are consolidated.
- [ ] Incident Commander is focused on command/coordination unless staffing requires otherwise.

## Investigate
- [ ] High-priority hypotheses are falsifiable.
- [ ] Investigators record evidence for and against hypotheses.
- [ ] Evidence includes source and timestamp.
- [ ] Contradictions remain visible until resolved.
- [ ] Root cause is not declared from timing correlation alone.

## Mitigate
- [ ] Proposed action has a specific expected impact reduction.
- [ ] Blast radius and reversibility are known.
- [ ] Data/security/customer/dependency risks were reviewed.
- [ ] Success metric and observation window were defined before execution.
- [ ] Rollback/abort criteria were defined before execution.
- [ ] Required human approval was obtained.
- [ ] Actor and production change reference are recorded.

## Verify mitigation
- [ ] Predetermined signals were observed after action.
- [ ] Outcome is classified as successful, partially effective, ineffective, or harmful.
- [ ] Harmful action was aborted/rolled back when safe.
- [ ] Ineffective action is not repeated without new evidence.

## Communicate
- [ ] Update starts with verified impact/current status.
- [ ] Material changes since previous update are clear.
- [ ] Current response and next checkpoint are included.
- [ ] No unsupported recovery ETA appears.
- [ ] No unverified root cause appears as fact.
- [ ] Public/legal/regulatory/security-sensitive wording follows approval policy.
- [ ] Secrets, personal data, and confidential implementation details are excluded.

## Synchronize
- [ ] Impact and severity are reassessed.
- [ ] Facts/hypotheses/unknowns are updated.
- [ ] Stale tasks are closed or reassigned.
- [ ] Blockers and ownership gaps are escalated.
- [ ] Priorities reflect safety, impact reduction, dependency unblock value, urgency, reversibility, and evidence gain.
- [ ] Next checkpoint is set while active response continues.

## Recovery
- [ ] User-facing success is verified.
- [ ] Relevant error/latency/saturation/backlog signals recovered.
- [ ] Data correctness is checked when relevant.
- [ ] Dependency health is checked when relevant.
- [ ] Synthetic or real transaction verification exists when practical.
- [ ] Recovery remained stable for an appropriate observation window.
- [ ] Residual risks are explicit and owned.

## Transition / closure
- [ ] Active-response timeline is preserved.
- [ ] Decisions and approvals are traceable to evidence.
- [ ] Every temporary mitigation has an owner and review/removal condition.
- [ ] Material follow-up actions have owners and target checkpoints.
- [ ] Post-incident owner accepts the handoff.
- [ ] Required recovery/final communication is complete or awaiting a named approver.
- [ ] No blocking risk remains ownerless.
- [ ] Incident state can pass `scripts/incident_validator.py` when structured JSON is used.

## Continuous improvement
- [ ] Validated lessons are separated from speculation.
- [ ] Repeatable failures are candidates for runbook, test, alert, workflow, or guardrail improvements.
- [ ] Improvements are not generalized from one unexplained anomaly.
- [ ] Individual blame is not substituted for systemic analysis.