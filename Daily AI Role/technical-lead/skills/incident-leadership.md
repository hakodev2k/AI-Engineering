# Incident Leadership

## Purpose
Coordinate technical incident response while preserving evidence, decision clarity, and safe recovery.

## Trigger
Production degradation, outage, data integrity concern, security-relevant event, or repeated critical failure.

## Procedure
1. Declare severity from user/business impact and blast radius.
2. Assign incident lead, investigator(s), communications owner, and verifier.
3. Stabilize first when a reversible containment exists.
4. Build a timeline from evidence; distinguish fact, hypothesis, and action.
5. Time-box hypotheses and avoid multiple uncontrolled changes.
6. Require explicit verification after each remediation.
7. Escalate destructive, security, data-repair, or broad production actions for human approval.
8. Close only after impact is cleared and monitoring confirms recovery.
9. Capture follow-up prevention work with owners and deadlines.

## Rules
- Never erase logs/evidence to make recovery easier.
- Never run destructive remediation without approval and rollback/recovery plan.
- Keep stakeholder updates factual; do not present hypotheses as root cause.
- Prefer one controlled variable change at a time when impact allows.

## Output
Incident timeline, current state, decisions, actions, evidence, residual risks, and follow-up work.