# Platform Network Boundaries

## Purpose
Design and enforce network boundaries that limit lateral movement, protect control-plane services, constrain workloads, and reduce exposure between tenants and environments.

## When to use
Use when designing shared platform networking, exposing internal APIs, connecting clusters/accounts, adding ingress or egress paths, or investigating unexpected reachability.

## Inputs
Network topology, service inventory, trust zones, ingress/egress rules, service discovery, DNS, load balancers, proxies, firewalls, network policies, and runtime telemetry.

## Context to inspect
Inspect control-plane endpoints, metadata services, management ports, east-west traffic, egress destinations, cross-environment links, shared proxies, service meshes, and emergency access paths.

## Core knowledge
Network location is not identity. Network controls should reduce reachability and blast radius while application and workload identity still enforce authorization. Default-deny strategies are strongest when service dependencies are known and observable.

## Procedure
1. Map required communication flows by service, tenant, and environment.
2. Classify control-plane, data-plane, management, and external traffic.
3. Identify unnecessary broad routes and shared trust zones.
4. Apply deny-by-default segmentation where operationally feasible.
5. Restrict management endpoints to approved identities and paths.
6. Protect metadata and node-local privileged services.
7. Constrain workload egress to required destinations where practical.
8. Separate production from lower-trust environments.
9. Ensure proxies and meshes preserve workload identity and policy context.
10. Log denied and unusual flows without creating excessive noise.
11. Test lateral movement and cross-tenant reachability.
12. Revalidate rules after topology changes.

## Decision points
Use coarse network segmentation for blast-radius reduction and identity-aware controls for precise authorization. Do not rely on IP allowlists alone for dynamic workloads.

## Common failure patterns
Flat internal networks, unrestricted egress, management ports reachable from workloads, implicit trust through peering, and obsolete allow rules nobody owns.

## Verification
Verify intended flows succeed, prohibited flows fail, metadata access is constrained, production boundaries hold, and network telemetry can explain denials.

## Expected output
A documented network trust model, enforceable segmentation, validated reachability matrix, and monitored exceptions.

## Stop conditions
Stop and escalate when a required path bypasses all identity controls, segmentation would break unknown critical dependencies, or cross-tenant lateral movement is demonstrated.