# Security Logging and Audit Rules

## Purpose
Create trustworthy security evidence without introducing new data exposure.

## Scope
Authentication, authorization, administrative actions, policy failures, security events, and audit trails.

## MUST
- Record security-relevant events with timestamp, action, outcome, relevant identity, and correlation context sufficient for investigation.
- Protect audit records from unauthorized modification and access.
- Define retention appropriate to operational, security, and regulatory needs.
- Alert or surface high-risk patterns that require response.

## MUST NOT
- Log passwords, bearer tokens, private keys, or unnecessary sensitive payloads.
- Treat application debug logs as a substitute for required audit evidence.

## SHOULD
- Use structured, consistently named security events and centralized analysis.

## Exceptions
Data-minimization exceptions must preserve enough evidence to investigate high-risk actions while respecting privacy requirements.

## Verification
Inspect event schemas, redaction tests, retention/access configuration, sample investigations, and alert coverage.