# Zero Trust Architecture Rules

## Purpose
Define Senior-level architectural rules for Zero Trust systems so access decisions are explicit, contextual, continuously evaluated, and resistant to implicit trust.

## Scope
Applies to enterprise applications, cloud platforms, networks, identity systems, SaaS, endpoints, APIs, and workloads participating in a Zero Trust architecture.

## MUST
- The architecture MUST assume no identity, device, workload, network location, or session is inherently trusted.
- Every protected-resource access path MUST have an explicit policy decision point and an enforceable policy enforcement point.
- Access decisions MUST evaluate identity, requested resource, action, context, and risk signals appropriate to the asset sensitivity.
- Trust boundaries, policy decision points, policy enforcement points, authoritative identity sources, device-posture sources, and telemetry sources MUST be documented.
- High-value resources MUST use stronger controls than low-risk resources and MUST not rely solely on network location.
- Significant architecture changes MUST document effects on security, availability, privacy, operational complexity, interoperability, and rollback.
- Control dependencies MUST be mapped so failure of identity, policy, telemetry, DNS, certificate, or endpoint systems is understood before production deployment.

## MUST NOT
- The design MUST NOT treat internal networks, VPN membership, source subnet, or corporate ownership as sufficient proof of trust.
- Security controls MUST NOT be bypassed for convenience without approved, time-bounded exception handling.
- A single failed dependency MUST NOT silently convert a deny-by-default design into allow-by-default behavior for high-risk resources.
- Zero Trust claims MUST NOT be based on product deployment alone; enforcement behavior and evidence MUST be demonstrated.

## SHOULD
- Designs SHOULD prefer small, independently enforceable trust zones over large implicit-trust domains.
- Policy evaluation SHOULD occur as close as practical to the protected resource.
- Architectural decisions SHOULD preserve reversibility and avoid vendor-specific coupling unless justified by measured benefit.

## Exceptions
Exceptions require documented business need, scope, risk, compensating controls, expiry, owner, approval, and verification plan. High-risk exceptions require security-owner approval.

## Verification
Review architecture diagrams, access flows, policy engines, enforcement points, failure tests, configuration, audit logs, and threat models. Demonstrate that unauthorized paths are denied even when requests originate from nominally trusted networks.