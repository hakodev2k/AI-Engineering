# Audit and Logging Rules

## Purpose
Preserve sufficient identity evidence for detection, investigation, compliance, and accountability.

## Scope
Authentication, authorization, provisioning, privilege changes, policy changes, administrative actions, and identity lifecycle events.

## MUST
- Security-relevant identity events MUST record actor, target, action, result, time, and relevant correlation context.
- Audit records MUST be protected against unauthorized alteration and access.
- Logging schemas MUST distinguish authentication failure, authorization denial, provisioning failure, and administrative change.
- Retention and access MUST follow documented security and privacy requirements.

## MUST NOT
- MUST NOT log passwords, bearer tokens, private keys, recovery secrets, or equivalent authentication material.
- MUST NOT rely on application success messages as the sole evidence of privileged changes.
- MUST NOT disable identity audit logging without approved risk handling.

## SHOULD
- Correlate identity events across provider, application, and infrastructure layers using stable non-secret identifiers.

## Exceptions
Reduced logging requires documented reason, threat impact, alternate evidence, expiry, and approval.

## Verification
Inspect representative events, retention configuration, access controls, tamper protections, correlation tests, and incident-query usability.