# API Gateway Policy Rules

## Purpose
Use gateway controls consistently without assuming they replace application security.

## Scope
API gateways, reverse proxies, ingress layers, WAF policies, routing, and centralized enforcement.

## MUST
- Define which security controls are enforced at gateway versus application boundaries.
- Protect administrative gateway configuration with least privilege, review, and auditability.
- Test policy behavior for alternate routes, versions, methods, and direct-backend access.
- Keep critical gateway policies versioned and reviewable where platform capabilities allow.

## MUST NOT
- Assume gateway authentication eliminates resource-level authorization needs.
- Leave protected backends directly reachable in a way that bypasses mandatory gateway controls without equivalent protection.

## SHOULD
- Centralize uniform controls such as transport, coarse authentication, request limits, and protocol normalization when appropriate.

## Exceptions
Bypass paths require explicit architecture rationale, equivalent controls, monitoring, and security approval.

## Verification
Inspect routes, network exposure, policy configuration, direct-access tests, configuration history, and audit logs.