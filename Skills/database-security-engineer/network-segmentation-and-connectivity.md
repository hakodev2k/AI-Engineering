# Network Segmentation and Connectivity

## Purpose
Limit who can reach database endpoints and constrain lateral movement around critical data stores.

## When to use
Use for new deployments, cloud networking, firewall reviews, migrations, or unexpected database exposure.

## Inputs
Network diagrams, endpoints, source workloads, administrative paths, firewall/security-group rules, DNS, proxies, and private connectivity options.

## Context to inspect
Inspect public endpoints, peering, VPNs, service endpoints, bastions, proxies, replication links, monitoring agents, and egress capabilities.

## Core knowledge
Network controls complement identity controls; they do not replace authentication. Segmentation should express required flows explicitly and avoid broad address ranges that outlive workloads.

## Procedure
1. Inventory database listeners and required clients.
2. Map source-to-destination flows and ports.
3. Remove public exposure unless explicitly required.
4. Prefer private connectivity for internal workloads.
5. Restrict ingress to exact workload or network identities where supported.
6. Separate administrative paths from application paths.
7. Restrict database-initiated egress when feasible.
8. Validate DNS and failover behavior.
9. Monitor rule drift and denied connections.

## Decision points
Use proxies or gateways when centralized policy, pooling, or identity benefits justify added dependency. Bastions are appropriate for interactive administration but should not become permanent application relays.

## Common failure patterns
0.0.0.0/0 rules, stale allowlists, hidden public replicas, unrestricted egress, and failover endpoints not covered by policy.

## Verification
Test permitted and denied paths from representative networks and inspect effective rules.

## Expected output
A minimal connectivity matrix and enforced segmentation design.

## Stop conditions
Escalate if removing exposure could disconnect unknown production consumers or if network ownership prevents validation.