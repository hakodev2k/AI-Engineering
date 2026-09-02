# Security Architecture Rules

## Purpose
Embed security controls into cloud architecture so protection is structural, measurable, and resistant to configuration drift.

## Scope
Applies to trust boundaries, identity, network exposure, encryption, workload isolation, security services, logging, and control ownership.

## MUST
- Security architecture MUST identify protected assets, trust boundaries, threat scenarios, required controls, control owners, and verification evidence.
- Sensitive data and privileged control-plane operations MUST use encryption in transit and at rest where supported, with managed key ownership appropriate to risk.
- Internet-facing workloads MUST define authentication, authorization, rate limiting, abuse protection, vulnerability management, and security telemetry before production release.
- Security controls with platform-wide impact MUST be deployed through reviewed, auditable configuration and tested for failure modes.
- Material security exceptions MUST identify residual risk, compensating controls, owner, expiry or review date, and approving authority.

## MUST NOT
- MUST NOT disable preventive or detective controls merely to unblock deployment.
- MUST NOT assume a managed cloud service is secure by default without validating service configuration and shared-responsibility obligations.
- MUST NOT expose management interfaces publicly without explicit necessity and additional safeguards.

## SHOULD
- Prefer secure-by-default platform patterns that reduce application-team configuration burden.
- Use layered preventive, detective, and recovery controls for high-value workloads.

## Exceptions
Exceptions require threat context, evidence, compensating controls, rollback or remediation plan, and approval proportional to potential impact.

## Verification
Review threat models, architecture diagrams, IAM and network policy, encryption settings, security scans, configuration posture results, audit logs, and approved exceptions.