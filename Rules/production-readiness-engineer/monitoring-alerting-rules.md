# Monitoring and Alerting Rules
## Purpose
Ensure production issues are detected with actionable signal and appropriate urgency.
## Scope
Monitoring policies, alerts, SLO-based detection, paging, and operational notifications.
## MUST
- Critical user journeys and service objectives MUST have monitoring that detects material degradation.
- Paging alerts MUST be actionable, severity-appropriate, and routed to accountable responders.
- Alert thresholds MUST be based on SLOs, capacity boundaries, expected behavior, or demonstrated evidence.
- Readiness MUST confirm alert routing works.
- Critical alert conditions MUST have an associated first-response procedure or runbook.
## MUST NOT
- High-volume noisy alerts MUST NOT be accepted as a substitute for coverage.
- Monitoring MUST NOT rely only on infrastructure health when application-level user impact can occur independently.
- Unrouted or ownerless critical alerts MUST NOT pass readiness review.
## SHOULD
- Use symptom-based alerts for user impact and cause-based alerts for diagnosis.
- Remove stale, duplicate, or non-actionable alerts.
## Exceptions
Temporary gaps require compensating monitoring, named ownership, and a remediation deadline.
## Verification
Review alert definitions, routing tests, escalation policy, historical signal quality, and runbook links.