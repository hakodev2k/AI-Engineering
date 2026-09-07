# Release Communication Rules

## Purpose
Keep stakeholders and operators aligned on release scope, timing, risk, impact, decisions, and recovery without creating conflicting sources of truth.

## Scope
Applies to pre-release notices, live execution updates, customer/support coordination, decision records, and completion notices.

## MUST
- Communications MUST identify release scope, timing, affected systems or users, expected impact, owners, and the authoritative status source.
- Material schedule, scope, risk, outage, rollback, or abort changes MUST be communicated promptly to affected stakeholders.
- Live updates MUST distinguish confirmed facts from hypotheses and pending investigation.
- Customer-facing or support-facing impact statements MUST be reconciled with observed production evidence.
- Completion messages MUST state validation status and any known residual issues or follow-up actions.

## MUST NOT
- Sensitive credentials, exploitable security details, or unnecessary personal data MUST NOT be included in broad release communications.
- A release MUST NOT be described as successful before required post-release validation completes.
- Conflicting status channels MUST NOT be allowed to become independent sources of truth for critical decisions.

## SHOULD
- Communication templates SHOULD be concise, timestamped, audience-appropriate, and reusable.
- High-risk releases SHOULD predefine update cadence and escalation recipients.

## Exceptions
Restricted incidents may limit distribution; the restriction, approved audience, and alternate coordination path must be documented.

## Verification
Review release notices, timestamps, status records, stakeholder acknowledgements where required, incident/change updates, and final validation communication for consistency with actual execution evidence.