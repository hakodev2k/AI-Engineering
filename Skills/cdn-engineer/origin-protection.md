# Origin Protection

## Purpose
Protect origins from direct exposure, overload, abusive traffic, and cache-miss amplification.

## When to use
Use when placing applications behind a CDN, investigating origin saturation, or hardening public delivery paths.

## Inputs
Origin endpoints, network controls, CDN egress ranges or authenticated-origin features, capacity limits, traffic patterns.

## Context to inspect
DNS, firewalls, load balancers, authentication between edge and origin, rate limits, health checks, bypass paths.

## Core knowledge
A CDN cannot protect an origin that attackers can address directly. Defense combines network restriction, origin authentication, rate control, shielding, capacity management, and secret endpoint hygiene.

## Procedure
1. Inventory every origin address and bypass route.
2. Restrict origin ingress to trusted CDN paths where feasible.
3. Add cryptographic origin authentication when IP allowlisting is insufficient.
4. Remove public DNS leakage and obsolete endpoints.
5. Configure edge and origin rate limits.
6. Bound retries and failover.
7. Apply shielding/request collapsing for miss amplification.
8. Monitor origin RPS, connections, errors, and bypass traffic.
9. Test direct-origin access and overload scenarios.

## Decision points
Prefer mTLS or signed origin requests for strong identity; IP allowlists are simpler but operationally brittle. Preserve controlled administrative bypass only with explicit security controls.

## Common failure patterns
Public origin IP leakage, trusting spoofable headers, unlimited retries, health-check floods, shared secrets in code, and failover origins with weaker controls.

## Verification
Prove unauthorized direct requests fail, CDN-origin requests succeed, overload controls engage, and monitoring detects bypass attempts.

## Expected output
A hardened origin access model, capacity protections, and tested bypass/failure behavior.

## Stop conditions
Stop if restricting origin traffic could lock out required services or if production network changes lack approval.