# Incident Recovery

## Purpose
Coordinate safe restoration during active outages and data-loss incidents.

## Scope
Incident triage, restore decisions, communications, validation, escalation, and handoff.

## MUST
- Recovery actions during an incident MUST operate under the incident command or authorized change process appropriate to severity.
- Restore-point choice MUST be recorded with rationale, expected data loss, and evidence available at decision time.
- High-risk actions MUST distinguish analyze, recommend, prepare, and execute authority.
- Restored services MUST pass defined technical and business validation before incident closure or handoff.

## MUST NOT
- MUST NOT perform destructive production restores, failovers, or data replacement without authorized human approval.
- MUST NOT overwrite potentially recoverable source data before preserving evidence or an alternative copy when feasible.
- MUST NOT hide uncertainty about data loss or consistency.

## SHOULD
- Recovery progress SHOULD be communicated using measurable milestones and updated estimates.

## Exceptions
Immediate emergency deviations require the highest available authority, complete audit trail, and retrospective review.

## Verification
Inspect incident timeline, approvals, restore-point rationale, command logs, validation results, communications, and post-incident actions.