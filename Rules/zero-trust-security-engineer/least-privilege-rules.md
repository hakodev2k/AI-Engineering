# Least Privilege Rules

## Purpose
Limit access to the minimum permissions, duration, resources, and conditions required for legitimate work.

## Scope
Applies to human users, service accounts, workloads, roles, entitlements, and emergency access.

## MUST
- Permissions MUST map to documented responsibilities or machine functions.
- Privileged access MUST be time-bounded or periodically revalidated.
- New roles MUST avoid broad wildcard permissions unless technically unavoidable and approved.
- Access removal MUST occur promptly when employment, ownership, workload, or purpose changes.

## MUST NOT
- MUST NOT grant administrator access as a default troubleshooting shortcut.
- MUST NOT accumulate privileges indefinitely through role changes.
- MUST NOT use shared privileged credentials where attributable identity is possible.

## SHOULD
- Prefer just-in-time elevation and task-scoped roles for sensitive operations.
- Entitlement design SHOULD separate read, change, approval, and destructive authority when practical.

## Exceptions
Exceptions require named owner, business justification, assessed blast radius, compensating monitoring, approval, and expiry.

## Verification
Use entitlement reviews, policy simulation, access logs, role-diff analysis, stale-access reports, and tests demonstrating denied actions outside the intended responsibility.