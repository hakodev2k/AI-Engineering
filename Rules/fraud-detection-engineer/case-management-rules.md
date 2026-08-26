# Case Management Rules

## Purpose
Ensure manual fraud review is prioritized, consistent, auditable, and operationally sustainable.

## Scope
Alert queues, case creation, routing, investigator decisions, escalations, and feedback.

## MUST
- Cases MUST contain sufficient decision context and evidence for a reviewer to act without reconstructing hidden system state.
- Queue prioritization MUST reflect risk, urgency, value, and service-level obligations.
- Investigator dispositions MUST use defined categories with uncertainty represented explicitly.
- Material case decisions and overrides MUST be auditable.

## MUST NOT
- MUST NOT flood review queues with alerts beyond sustainable capacity without an approved degradation strategy.
- MUST NOT use reviewer throughput as the sole measure of review quality.

## SHOULD
- Case tooling SHOULD surface related entities and prior decisions without biasing reviewers toward unsupported conclusions.

## Exceptions
Emergency triage changes require owner, bounded duration, and post-event review.

## Verification
Inspect queue metrics, case completeness, disposition consistency, override logs, SLA performance, and sampled review quality.