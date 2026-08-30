# Trust Boundary Rules

## Purpose
Make trust transitions explicit so controls are placed where privilege, identity, data, or execution context changes.

## Scope
Applies to network zones, services, tenants, user-to-service transitions, service-to-service calls, administrative paths, third parties, and execution environments.

## MUST
- Architecture documentation MUST identify trust boundaries and the security assumptions on each side.
- Every trust-boundary crossing MUST define authentication, authorization, input validation, confidentiality, integrity, and audit requirements as applicable.
- Privileged and administrative paths MUST use stronger controls than ordinary application traffic where their impact warrants it.
- Cross-tenant and cross-environment boundaries MUST be explicitly protected against unintended data or privilege propagation.
- Boundary controls MUST fail securely when identity, policy, or validation dependencies are unavailable.

## MUST NOT
- MUST NOT infer trust from network location alone.
- MUST NOT allow internal traffic to bypass authorization solely because it originated inside a private network.
- MUST NOT merge trust zones without assessing blast radius and compensating controls.

## SHOULD
- Trust should be minimized and continuously revalidated at meaningful boundaries.
- High-impact boundaries SHOULD have independent monitoring and test coverage.

## Exceptions
Any exception requires documented threat impact, compensating controls, residual risk, and accountable approval.

## Verification
Review architecture diagrams, policy definitions, network and identity configuration, integration tests, penetration results, and logs for boundary crossings.