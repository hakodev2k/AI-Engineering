# Cloud DNS and Private Endpoints

## Purpose
Engineer DNS for cloud services, private endpoints, hybrid networks, and multi-account/subscription estates.

## When to use
Private service access, cloud landing zones, hybrid resolution, SaaS private links, or cloud DNS incidents.

## Inputs
Cloud networks/accounts, private zones, endpoints, resolver services, on-prem DNS, forwarding rules, application names.

## Context to inspect
Zone associations, resolver inbound/outbound endpoints, conditional forwarding, provider-generated names, split horizon, routing and firewall paths.

## Core knowledge
Private endpoints often require DNS override from public service names to private addresses. Correct DNS depends on both zone linkage and resolver network reachability.

## Procedure
1. Trace provider-documented name chain for the service.
2. Map client resolver paths across cloud/on-prem.
3. Identify required private zones and associations.
4. Configure inbound/outbound resolver endpoints where needed.
5. Add narrow conditional forwarding rules.
6. Prevent forwarding loops and broad zone shadowing.
7. Validate endpoint IP lifecycle and automation.
8. Query from each network/account class.
9. Test failure of hybrid links/resolver endpoints.
10. Document ownership and scaling quotas.

## Decision points
Centralize private DNS when governance and shared connectivity justify it; decentralize where account autonomy/failure isolation dominates. Forward only necessary namespaces.

## Common failure patterns
Missing zone links, shadowing public namespaces, wrong private zone name, circular forwarding, endpoint recreated with stale A record, and DNS working only inside one VPC/VNet.

## Verification
Resolve expected private/public answers from all client classes, confirm routing to returned IPs, and test failover.

## Expected output
Cloud DNS topology, private-zone/forwarding configuration, client test matrix, and operational ownership.

## Stop conditions
Escalate when provider naming semantics are uncertain, shared resolver changes affect unrelated tenants, or network reachability prevents valid testing.