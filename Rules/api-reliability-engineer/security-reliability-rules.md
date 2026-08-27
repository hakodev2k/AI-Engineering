# Security and Reliability Rules

## Purpose
Ensure reliability controls do not weaken security and security mechanisms fail predictably under stress.

## Scope
Covers authentication, authorization, secrets, abuse controls, degraded modes, emergency access, and security dependencies.

## MUST
- Authentication and authorization failures MUST default to safe denial when required security evidence is unavailable.
- Security dependencies MUST have reliability budgets and failure behavior appropriate to critical API paths.
- Secrets and credentials MUST be managed outside source code and protected from telemetry.
- Emergency access or bypass mechanisms MUST be time-bounded, auditable, least-privileged, and human-approved.
- Reliability tests MUST include security-control behavior during overload and dependency failure.

## MUST NOT
- MUST NOT disable authentication, authorization, TLS validation, abuse controls, or tenant isolation merely to restore availability.
- MUST NOT log tokens, private keys, passwords, or equivalent credentials.
- MUST NOT treat security controls as optional latency overhead without measured risk analysis.

## SHOULD
- Security-critical dependencies SHOULD have tested fail-safe and recovery procedures.
- Abuse and reliability telemetry SHOULD be correlated without exposing sensitive identity data unnecessarily.

## Exceptions
Any weakening of a security control requires explicit accountable human approval, documented risk, duration, compensating controls, and restoration verification.

## Verification
Use configuration review, security tests, secret scanning, fault injection, audit logs, access review, and incident exercises.