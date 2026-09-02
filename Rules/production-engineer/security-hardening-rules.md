# Security Hardening Rules

## Purpose
Reduce production attack surface while preserving operability and recoverability.

## Scope
Applies to hosts, containers, runtimes, network exposure, services, dependencies, and operational controls.

## MUST
- Production systems MUST use secure defaults and disable unnecessary services, ports, protocols, and administrative interfaces.
- Critical security controls MUST be validated in the deployed environment rather than inferred from configuration intent alone.
- Known critical vulnerabilities MUST be remediated, mitigated, or explicitly risk-accepted by an authorized owner.
- Security-sensitive changes MUST preserve auditability and rollback or recovery capability.

## MUST NOT
- MUST NOT weaken TLS, authentication, authorization, isolation, or network controls merely to simplify troubleshooting.
- MUST NOT expose management endpoints publicly unless explicitly required and protected.
- MUST NOT claim a system is hardened without configuration or runtime evidence.

## SHOULD
- Automate baseline policy checks and drift detection.
- Minimize privileged runtime capabilities.

## Exceptions
Exceptions require documented threat impact, compensating controls, expiry, and accountable approval.

## Verification
Inspect runtime configuration, network exposure, vulnerability scans, policy checks, audit logs, and drift reports.
