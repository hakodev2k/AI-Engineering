# Metrics and Response Quality Rules

## Purpose
Measure incident-response effectiveness without incentivizing premature closure or hidden risk.

## Scope
Applies to operational metrics, quality reviews, and continuous improvement for AI incident response.

## MUST
- Response metrics MUST be interpreted alongside incident severity, recurrence, detection quality, and remediation effectiveness.
- Teams MUST track material detection and response gaps identified through incidents and exercises.
- Closure metrics MUST NOT reward responders for declaring resolution before verification is complete.
- Recurrence of previously addressed incident classes MUST trigger review of corrective-action effectiveness.
- Metrics used for decision-making MUST have defined calculation, scope, and data source.
- AI-specific incident trends MUST be separated sufficiently to identify model, retrieval, agent, safety, provider, and infrastructure failure patterns when relevant.

## MUST NOT
- Mean time to resolution MUST NOT be optimized by skipping evidence collection, safety review, or remediation verification.
- Raw incident count MUST NOT be used alone as a measure of system safety or reliability.
- Missing incidents or unreported near misses MUST NOT be interpreted as evidence of zero risk.

## SHOULD
- Track time to detect, contain, recover, verify, and complete corrective actions.
- Measure alert quality and recurrence in addition to response speed.

## Exceptions
Metric definitions may vary by organization, but they must remain reproducible and resistant to obvious gaming.

## Verification
Inspect metric definitions, dashboards, incident samples, action completion, recurrence data, and quality-review findings.