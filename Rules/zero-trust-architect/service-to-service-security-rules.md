# Service-to-Service Security Rules

## Purpose
Secure machine-to-machine communication with authenticated workload identity, explicit authorization, and bounded failure behavior.

## Scope
Applies to APIs, microservices, message consumers, internal RPC, service meshes, and platform-to-platform integrations.

## MUST
- Each service interaction MUST authenticate the calling workload when the target resource is protected.
- Authorization MUST be enforced at the receiving service or a trusted enforcement layer immediately protecting it.
- Service credentials MUST be short-lived or automatically rotated where supported.
- Sensitive service traffic MUST use transport protection appropriate to the threat model.
- Retry, timeout, and failover behavior MUST preserve authorization and MUST NOT route around policy controls.
- Cross-environment and cross-tenant calls MUST use distinct identities and explicit policy.

## MUST NOT
- Internal DNS names, cluster membership, source IP, or network locality MUST NOT be treated as sufficient proof of service identity.
- Shared static credentials MUST NOT be reused across unrelated services.
- Service fallback paths MUST NOT silently weaken authentication or authorization.
- Debug endpoints MUST NOT bypass normal identity controls in production.

## SHOULD
- Mutual TLS or signed workload tokens SHOULD be used when appropriate to the platform.
- Service identities SHOULD map clearly to deployment ownership and operational accountability.
- Authorization policies SHOULD be narrow enough that compromise of one service does not expose unrelated systems.

## Exceptions
Exceptions require technical justification, explicit scope, threat impact, compensating controls, owner, expiry, and security approval.

## Verification
Inspect service identities, TLS configuration, trust stores, tokens, service-mesh policies, API authorization, traces, and negative tests. Verify compromised or unrelated workloads cannot call protected service operations.