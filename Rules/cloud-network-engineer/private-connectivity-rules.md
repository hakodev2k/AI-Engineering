# Private Connectivity Rules

## Purpose
Ensure private service connectivity is intentional, isolated, and supportable.

## Scope
Applies to private endpoints, service endpoints, private links, internal load balancers, and provider-native private connectivity.

## MUST
- Private connectivity MUST define producer, consumer, DNS behavior, routing path, and authorization boundary.
- Endpoint policies and service permissions MUST follow least privilege.
- Private endpoint DNS resolution MUST be validated from every intended consumer network.
- Changes MUST account for failover, regional dependencies, and service quotas.
- Access paths MUST be documented so operators can distinguish private from public traffic.

## MUST NOT
- MUST NOT assume private addressing alone provides authorization.
- MUST NOT leave unintended public access enabled when the approved architecture requires private-only access.
- MUST NOT introduce private endpoints without checking DNS collision and routing implications.

## SHOULD
- Prefer provider-supported private connectivity over public traversal when security and reliability justify it.
- Monitor endpoint health and connection acceptance state.

## Exceptions
Exceptions require documented service limitations, security review, risk acceptance, and compensating controls.

## Verification
Inspect endpoint configuration, policies, DNS answers, effective routes, connectivity tests, and public exposure settings.