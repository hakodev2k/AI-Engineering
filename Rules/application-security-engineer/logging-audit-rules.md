# Security Logging and Audit Rules

## Purpose
Produce trustworthy evidence for detection, investigation, accountability, and security verification without creating new data-exposure risk.

## Scope
Applies to authentication, authorization, privilege changes, sensitive actions, administrative activity, security-control failures, and application audit trails.

## MUST
- Security-relevant events MUST capture enough context to answer who or what acted, what action occurred, target, outcome, and time, subject to data-minimization constraints.
- Privilege changes, administrative actions, security configuration changes, and material authentication events MUST be auditable where the system supports them.
- Logs used for security decisions MUST have controlled access and integrity protections appropriate to their evidentiary value.
- Correlation identifiers and consistent timestamps MUST support cross-service investigation where distributed execution is material.
- Logging failures for critical audit events MUST have defined behavior and monitoring.

## MUST NOT
- MUST NOT log passwords, private keys, session tokens, access tokens, reset tokens, or unnecessary sensitive payloads.
- MUST NOT treat user-controlled log text as trusted structured metadata without safe encoding/normalization.
- MUST NOT allow ordinary application users to alter authoritative audit history.

## SHOULD
- SHOULD distinguish audit events from verbose diagnostic logs and define retention according to investigative need and policy.
- SHOULD make high-value security events machine-queryable.

## Exceptions
Exceptions require documented event gap, risk, alternative evidence, owner, and review date.

## Verification
Inspect event schemas, sample logs, redaction tests, access policies, retention, tamper controls, alert integration, and incident reconstruction exercises.