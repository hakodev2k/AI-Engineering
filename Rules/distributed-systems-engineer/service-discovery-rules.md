# Service Discovery Rules

## Purpose
Keep endpoint discovery accurate during deployment, scaling, and failure.

## Scope
Registries, DNS, client-side discovery, proxies, and load balancers.

## MUST
- Discovery mechanisms MUST define health, freshness, and deregistration semantics.
- Clients MUST tolerate transient stale endpoints and topology changes.
- Endpoint identity and transport security MUST be preserved through discovery.

## MUST NOT
- MUST NOT rely on permanently cached endpoint sets where membership changes dynamically.
- MUST NOT route to unhealthy instances solely because registration still exists.

## SHOULD
- Discovery data SHOULD have bounded staleness and observable propagation latency.

## Exceptions
Static endpoints require documented immutability and operational ownership.

## Verification
Test registration, deregistration, stale cache behavior, failover, and endpoint-authentication paths.