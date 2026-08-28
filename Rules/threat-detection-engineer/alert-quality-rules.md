# Alert Quality Rules

## Purpose
Ensure detection alerts contain sufficient context for reliable analyst decisions.

## Scope
Applies to alert titles, severity, evidence, entities, enrichment, routing, and analyst-facing metadata.

## MUST
- Alerts MUST identify the triggering evidence, affected entities, event time, and detection rationale.
- Severity MUST reflect potential impact and confidence, not merely rule complexity.
- Required investigation context MUST be available without exposing secrets or unnecessary sensitive data.
- Alert routing MUST match ownership and response expectations for the affected environment.

## MUST NOT
- MUST NOT emit opaque high-severity alerts with no explainable trigger.
- MUST NOT use misleading titles that assert compromise when the evidence only indicates suspicion.
- MUST NOT overload alerts with unrelated enrichment that obscures primary evidence.

## SHOULD
- Alerts SHOULD include concise next-step guidance and links to relevant investigation context.
- Entity normalization SHOULD enable pivoting across identity, host, cloud, and network evidence.

## Exceptions
Exceptions require documented platform constraints, risk, compensating context, and owner.

## Verification
Sample alerts for completeness, analyst usability, severity consistency, routing correctness, and sensitive-data handling.