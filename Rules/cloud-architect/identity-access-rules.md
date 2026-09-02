# Identity and Access Rules

## Purpose
Make identity the primary cloud security boundary and enforce least privilege at architectural scale.

## Scope
Applies to human identities, workload identities, federation, privileged roles, service accounts, and cross-boundary access.

## MUST
- Access MUST use centralized identity and federation where feasible.
- Privileged access MUST be least-privilege, time-bounded where supported, auditable, and separated from routine user access.
- Workloads MUST use dedicated machine identities instead of shared human credentials.
- Cross-account or cross-project trust MUST define principal, scope, conditions, owner, and revocation path.
- Break-glass access MUST be controlled, monitored, periodically tested, and independently reviewed.

## MUST NOT
- MUST NOT embed long-lived cloud credentials in code, images, templates, or user-managed files.
- MUST NOT grant broad administrative roles merely to resolve permission errors.
- MUST NOT create unmanaged shared identities for convenience.

## SHOULD
- Prefer short-lived credentials and workload identity federation.
- Review high-risk permissions using effective-access analysis.

## Exceptions
Exceptions require documented need, expiry, compensating controls, auditability, and security approval.

## Verification
Inspect IAM policies, trust relationships, credential age, privileged-access logs, service identities, and access-review evidence.