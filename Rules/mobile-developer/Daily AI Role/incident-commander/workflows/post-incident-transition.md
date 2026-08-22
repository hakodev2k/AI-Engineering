# Workflow: Post-Incident Transition

## Trigger
Active impact has been controlled and recovery verification has passed, but follow-up investigation, remediation, communication, or risk work remains.

## Goal
Transfer the incident from urgent response to accountable follow-up without losing evidence, temporary mitigations, unresolved risks, or ownership.

## Inputs
- Final active incident state
- Recovery evidence
- Timeline and decision log
- Temporary mitigations/workarounds
- Unresolved hypotheses/root-cause questions
- Residual risks
- Stakeholder communication state

## Stages

### 1. Validate transition readiness
**Owner:** Incident Commander + Risk and Recovery Reviewer
- Confirm user/business impact is controlled.
- Confirm recovery evidence spans an appropriate observation window.
- Confirm no hidden critical task remains active.
- Record any accepted residual impact explicitly.

If these conditions are not met, remain in the active response workflow.

### 2. Freeze the active-response snapshot
**Owner:** Evidence Keeper
Capture:
- incident start/control/recovery timestamps;
- severity history;
- confirmed facts;
- major hypotheses and outcomes;
- actions/mitigations and observed effects;
- decisions and approvals;
- stakeholder updates;
- unresolved contradictions.

Do not rewrite the history to fit a later narrative.

### 3. Inventory temporary mitigations
For every workaround, rollback, capacity increase, feature disablement, traffic shift, manual process, or configuration exception record:
- owner;
- reason;
- operational risk;
- expiry/review date;
- rollback/removal condition;
- monitoring requirement.

Temporary mitigations without an owner are transition blockers.

### 4. Convert unresolved work into follow-up actions
Create actionable items for:
- root-cause investigation;
- permanent remediation;
- monitoring/alerting gaps;
- runbook gaps;
- test/verification gaps;
- architectural risks;
- dependency/vendor follow-up;
- customer/support follow-up;
- process improvements.

Each item needs an owner, outcome, priority, target date/checkpoint, and evidence of completion.

### 5. Assign post-incident owner
The Incident Commander may facilitate but should not silently own all remediation. Assign an accountable engineering/service/problem-management owner according to organizational practice.

### 6. Prepare post-incident review input
Provide evidence, not a pre-decided blame narrative. Review should distinguish:
- contributing conditions;
- triggering event if known;
- detection gaps;
- response strengths/weaknesses;
- systemic causes;
- corrective/preventive actions.

Root cause may remain `unknown` or `under investigation` until evidence supports a conclusion.

### 7. Close communication loop
Send or draft the appropriate recovery/closure update. Public, contractual, legal, security-sensitive, or regulatory messaging remains subject to human approval.

### 8. Capture reusable learning
Convert validated learning into durable assets when justified:
- runbook change;
- alert/monitoring improvement;
- new automated validation;
- safer deployment guardrail;
- updated ownership map;
- incident rule/checklist improvement.

Do not institutionalize a workaround based on one unexplained anomaly.

## Review point
Before ending Incident Commander ownership, verify `../checklists/incident-command-checklist.md` closure and transition sections.

## Failure paths
- Recovery signal regresses → return immediately to `major-incident-response.md`.
- Follow-up owner unavailable → escalate; do not close with ownerless high-risk work.
- Timeline incomplete → preserve known evidence and explicitly list gaps instead of fabricating reconstruction.
- Stakeholders dispute facts → preserve competing claims and resolve through evidence during review.

## Definition of Done
- Recovery remains stable.
- Active-response snapshot is preserved.
- Every temporary mitigation has an owner and review/removal condition.
- Material follow-up actions have owners and target checkpoints.
- Post-incident owner accepts the handoff.
- Required recovery communication is completed or awaiting a named approver.
- Incident Commander can step away without losing accountability or operational knowledge.