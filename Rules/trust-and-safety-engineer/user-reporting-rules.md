# User Reporting Rules

## Purpose
Ensure user reporting channels produce actionable, safe, and auditable signals without creating retaliation, privacy, or abuse vectors.

## Scope
Applies to report intake, categorization, evidence capture, deduplication, triage, reporter feedback, and misuse prevention.

## MUST
- Reporting flows MUST collect the minimum information needed to investigate the reported harm.
- Report categories MUST map to the current abuse taxonomy or an explicit unknown/other path.
- High-severity reports MUST have defined triage targets and escalation paths.
- Report handling MUST protect reporter identity and sensitive evidence from unnecessary exposure.
- Duplicate reports MUST be consolidated without discarding materially different evidence.
- Reporter abuse, coordinated false reporting, and retaliation patterns MUST be detectable and handled separately from the underlying allegation.
- Systems MUST preserve report state transitions and decision outcomes for auditability.

## MUST NOT
- MUST NOT reveal reporter identity to the reported party unless legally required and explicitly approved.
- MUST NOT treat report volume alone as proof of violation.
- MUST NOT silently discard reports because automated classification fails.
- MUST NOT require users to provide unnecessary sensitive data to submit a safety report.

## SHOULD
- Reporting UX SHOULD set expectations about what can be reported and what evidence is useful.
- Reporters SHOULD receive status feedback when doing so does not create safety or privacy risk.
- Triage SHOULD prioritize severity and immediacy of harm rather than submission order alone.

## Exceptions
Legal, emergency, or jurisdiction-specific workflows MAY require additional data. The requirement MUST be documented, access-controlled, and limited to the relevant workflow.

## Verification
Inspect report schemas, privacy controls, triage queues, SLA metrics, duplicate handling, audit logs, and sampled cases. Verify that high-severity reports are escalated and that report count does not directly trigger irreversible action without corroboration.