# Logging and Audit Architecture Rules

## Purpose
Ensure security-relevant activity is observable, attributable, protected, and usable during investigations.

## Scope
Application logs, audit trails, identity events, administrative actions, security telemetry, and retention architecture.

## MUST
- Security-relevant events MUST identify actor, action, target, result, time, and relevant context where available.
- Audit records for privileged actions MUST be protected against unauthorized alteration and deletion.
- Logging architecture MUST define retention, access, integrity, time synchronization, and failure behavior.
- Sensitive values MUST be redacted or excluded according to data-protection requirements.
- Detection-critical events MUST reach monitoring systems with bounded delay.

## MUST NOT
- MUST NOT log passwords, private keys, authentication tokens, or unnecessary sensitive payloads.
- MUST NOT depend on application-local logs alone for high-impact audit evidence.
- MUST NOT claim forensic readiness without validating event coverage and retention.

## SHOULD
- Prefer structured logs, consistent identifiers, centralized collection, and tamper-evident storage for critical audit data.

## Exceptions
Require documented investigative impact, compensating telemetry, bounded duration, and approval.

## Verification
Inspect event schemas, sample logs, access policy, retention configuration, clock synchronization, redaction tests, and detection pipelines.