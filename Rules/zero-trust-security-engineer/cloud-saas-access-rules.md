# Cloud and SaaS Access Rules

## Purpose
Apply consistent Zero Trust controls to cloud control planes, SaaS applications, and externally hosted services.

## Scope
Applies to cloud consoles and APIs, SaaS administrative portals, federated applications, and managed services.

## MUST
- Cloud and SaaS access MUST use centrally governed identities where supported.
- Privileged cloud roles MUST be least-privileged, attributable, and regularly reviewed.
- SaaS applications handling sensitive data MUST have explicit access, session, and sharing policies.
- High-risk administrative access MUST be protected by strong authentication and contextual controls.

## MUST NOT
- MUST NOT rely on unmanaged local administrator accounts as the normal access path.
- MUST NOT leave default broad sharing or public-access settings enabled without documented need.
- MUST NOT create long-lived access keys when federated or short-lived alternatives are available.

## SHOULD
- Cloud and SaaS policy SHOULD integrate device, risk, and location context where reliable and appropriate.
- Administrative paths SHOULD be separated from routine user access.

## Exceptions
Provider limitations require documented residual risk, compensating controls, owner, approval, and remediation review date.

## Verification
Inspect federation, conditional-access policy, role assignments, sharing configuration, API keys, administrative logs, and negative tests for unmanaged, stale, or unauthorized identities.