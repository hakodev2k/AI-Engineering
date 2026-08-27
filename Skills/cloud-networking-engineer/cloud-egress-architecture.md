# Cloud Egress Architecture

## Purpose
Control and scale outbound cloud traffic while managing security, source identity, availability, cost, and third-party allowlisting.

## When to use
Use for NAT gateways, centralized egress, proxy/firewall egress, fixed source IP requirements, or egress-cost/exhaustion incidents.

## Inputs
Outbound destinations, connection rates, bandwidth, source-IP requirements, inspection policy, availability targets, regions/zones, and cost constraints.

## Preconditions
Identify which workloads truly require internet or external-network egress.

## Context to inspect
Default routes, NAT gateways/instances, proxies, firewalls, public IPs, port utilization, DNS, private service endpoints, logs, quotas, and cross-zone charges.

## Core knowledge
NAT has finite ports and throughput. Centralized egress simplifies governance but can add cross-zone cost, latency, and failure concentration. Private endpoints often remove the need for internet egress to managed services.

## Procedure
1. Inventory outbound flows and destinations.
2. Eliminate unnecessary public paths using private endpoints where appropriate.
3. Determine fixed-source and inspection requirements.
4. Choose distributed or centralized egress topology.
5. Size NAT/proxy/firewall capacity and port space.
6. Design zone/region redundancy.
7. Apply destination and identity policy where possible.
8. Instrument connections, ports, bytes, drops, and cost.
9. Load-test connection churn and failover.
10. Document third-party allowlist and IP-rotation procedures.

## Decision points
Use distributed zonal NAT for resilience/simplicity; centralized egress when governance benefits exceed added complexity. Use explicit proxies when application-aware policy/audit is required.

## Common failure patterns
NAT port exhaustion, one egress appliance for multiple zones, hairpin charges, public access to services with private endpoints available, and untracked fixed IP dependencies.

## Verification
Measure throughput and connection scale, simulate egress component failure, confirm source addresses, validate denied destinations, and compare expected versus observed cost.

## Expected output
An egress topology, capacity model, policy, monitoring, and tested failover plan.

## Stop conditions
Stop if outbound dependencies are unknown, source-IP changes affect external partners without coordination, or security inspection requirements are unresolved.