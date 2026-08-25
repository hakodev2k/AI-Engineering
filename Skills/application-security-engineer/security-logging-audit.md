# Security Logging and Audit

## Purpose
Create trustworthy, privacy-aware evidence for detecting abuse, investigating incidents, and proving sensitive actions occurred.

## When to use
Use for authentication, authorization, admin actions, sensitive data access, financial/security workflows, and incident-readiness reviews.

## Inputs
Threat model, event taxonomy, logging code, identity model, retention requirements, SIEM pipeline, and privacy constraints.

## Context to inspect
Inspect event generation, transport, timestamps, correlation IDs, access to logs, retention, redaction, and alert consumers.

## Core knowledge
Security logs should answer who did what, to which resource, when, from what context, and with what result without recording secrets or unnecessary sensitive payloads. Audit integrity and availability matter.

## Procedure
1. Identify security-relevant decisions and high-value state changes.
2. Define stable event names and required fields.
3. Record authenticated actor, effective actor, target, action, result, and correlation context where appropriate.
4. Exclude passwords, tokens, secret keys, and unnecessary sensitive content.
5. Protect logs from application-level tampering and unauthorized access.
6. Normalize time and preserve traceability across services.
7. Define retention and deletion aligned with policy.
8. Build alerts for actionable abuse patterns, not every event.
9. Test event emission for success and failure paths.

## Decision points
Use immutable/audited stores for high-assurance records; ordinary telemetry may suffice for diagnostic events. Log identifiers rather than full sensitive objects when possible.

## Common failure patterns
Logging secrets, missing failed authorization events, mutable local-only audit logs, inconsistent actor IDs, and alerts without response owners.

## Verification
Execute representative sensitive actions and confirm complete, correctly redacted, searchable events reach the intended backend.

## Expected output
An event taxonomy, secure instrumentation, alert mappings, and verification evidence.

## Stop conditions
Escalate conflicts between audit retention and privacy/legal requirements or evidence that logging infrastructure is compromised.