# Security Boundary Rules

## Purpose
Preserve authentication, authorization, confidentiality, and trust boundaries across distributed calls.

## Scope
Service-to-service traffic, external APIs, queues, control planes, and data flows.

## MUST
- Every cross-service call MUST authenticate the caller where trust is not implicit and formally bounded.
- Authorization MUST be enforced at the resource or action boundary that owns the protected operation.
- Sensitive data in transit MUST use approved transport protection.
- Service credentials MUST be scoped, rotated, and stored using approved secret-management mechanisms.

## MUST NOT
- MUST NOT trust network location alone as authorization.
- MUST NOT propagate end-user privileges farther than required.
- MUST NOT disable verification controls to resolve availability incidents without explicit approval.

## SHOULD
- Prefer short-lived workload identities over static credentials.

## Exceptions
Security exceptions require risk owner, expiry, compensating controls, and explicit approval.

## Verification
Inspect identity flows, authorization tests, transport configuration, secret scanning, and least-privilege evidence.