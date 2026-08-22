# Security Hardening Rules

## Purpose
Reduce infrastructure attack surface through secure defaults, patching, and explicit hardening standards.

## Scope
Applies to hosts, containers, orchestrators, cloud services, managed platforms, and administrative interfaces.

## MUST
- Security-relevant defaults MUST be reviewed before production use.
- Supported security patches MUST be applied according to documented severity and exposure criteria.
- Unused services, ports, accounts, and capabilities MUST be disabled or removed.
- Administrative interfaces MUST use strong authentication and restricted network access.
- Hardening deviations MUST have an owner, reason, risk, and review date.

## MUST NOT
- MUST NOT disable security controls merely to simplify deployment.
- MUST NOT expose default credentials, sample keys, or insecure management endpoints.
- MUST NOT postpone critical remediation without documented risk acceptance.

## SHOULD
- Prefer hardened base images, platform baselines, and automated compliance checks.
- Prefer immutable replacement over manual drift-prone patching where feasible.

## Exceptions
Urgent compatibility exceptions require explicit approval, compensating controls, and a remediation deadline.

## Verification
Use configuration inspection, vulnerability scanning, policy checks, port exposure review, patch reports, and security assessment evidence.