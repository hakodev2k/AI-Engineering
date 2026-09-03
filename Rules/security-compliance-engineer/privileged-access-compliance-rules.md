# Privileged Access Compliance Rules

## Purpose
Control elevated access that can materially affect security, data, infrastructure, or compliance evidence.

## Scope
Applies to administrative, root, break-glass, production, database, cloud, security-tool, and other elevated privileges.

## MUST
- Privileged access MUST be limited to authorized identities with documented business need and least-privilege scope.
- Privileged sessions or actions MUST be attributable to individual identities where technically feasible.
- Emergency access MUST be time-bounded and reviewed after use.
- Standing privileged access MUST be periodically revalidated and reduced where just-in-time access is practical.

## MUST NOT
- Shared administrator credentials MUST NOT be used when individual attribution is feasible.
- Privileged credentials MUST NOT be embedded in scripts, tickets, source code, or unsecured documentation.
- Approval and execution of high-risk privileged changes MUST NOT be performed by the same person where segregation is required.

## SHOULD
- Use privileged access management, session recording, and just-in-time elevation for high-risk systems.
- Alert on unusual privilege grants and emergency-account use.

## Exceptions
Any standing or shared privilege exception requires documented necessity, compensating controls, expiry, monitoring, and risk-owner approval.

## Verification
Inspect entitlement data, privileged-access logs, emergency-use records, session evidence, credential storage, and periodic review results.