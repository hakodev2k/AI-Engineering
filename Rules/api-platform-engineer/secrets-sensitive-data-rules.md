# Secrets and Sensitive Data

## Purpose
Prevent credential and sensitive-data exposure through the API platform.

## Scope
Secrets, certificates, tokens, headers, payloads, logs, traces, and configuration.

## MUST
- Secrets MUST come from approved secret-management mechanisms and be access-controlled.
- Sensitive data MUST be classified before it is logged, cached, transformed, or propagated.
- Rotation procedures MUST preserve service continuity and auditability.
- Diagnostic tooling MUST redact protected values.

## MUST NOT
- MUST NOT store credentials in source code, API specifications, examples, or plaintext configuration.
- MUST NOT log authentication tokens or full secret-bearing headers.

## SHOULD
- Prefer short-lived credentials and automated rotation where supported.

## Exceptions
Any temporary handling exception requires security approval, expiry, compensating controls, and cleanup evidence.

## Verification
Use secret scanning, configuration review, access audits, redaction tests, and rotation exercises.