# AI Incident Governance

## Purpose
Integrate AI-specific failures into incident response, risk escalation, evidence preservation, notification, and corrective-action processes.

## When to use
Use for harmful outputs, unsafe actions, data leakage, model compromise, systemic bias, material quality failure, unauthorized AI use, or control breakdown.

## Inputs
Incident timeline, logs, model/prompt/tool versions, affected users, data flows, evaluations, controls, legal notification criteria.

## Procedure
1. Triage severity and immediate harm.
2. Preserve relevant AI configuration and evidence.
3. Contain unsafe behavior using rollback, disablement, routing, or access controls.
4. Identify affected users, decisions, and data.
5. Engage security, privacy, legal, safety, and business owners as applicable.
6. Determine notification and reporting duties.
7. Analyze technical and governance root causes.
8. Define corrective and preventive actions with owners.
9. Revalidate before restoring service.
10. Feed lessons into risk taxonomy, evaluations, controls, and training.

## Decision points
Prioritize harm containment over model availability when safety or rights are materially at risk.

## Common failure patterns
Losing prompt/model versions, treating AI incidents as ordinary bugs, no user remediation, root cause limited to operator error, premature restoration.

## Verification
Incident record shows containment, evidence, impact analysis, required notifications, root cause, corrective actions, and validated recovery.

## Expected output
Governance-complete incident record and control improvements.

## Stop conditions
Escalate immediately for severe harm, regulated notification, or suspected malicious compromise.