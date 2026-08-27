# Cloud Transit Networking

## Purpose
Build scalable shared connectivity through transit gateways, virtual WANs, route servers, or equivalent cloud transit fabrics.

## When to use
Use when point-to-point peering no longer scales, centralized inspection is required, many networks must interconnect, or multiple regions/accounts need governed routing.

## Inputs
Connected networks, route domains, segmentation requirements, throughput, regions, hybrid links, inspection needs, quotas, and cost model.

## Preconditions
Document desired and forbidden transitive paths before attaching networks.

## Context to inspect
Transit attachments, route tables/domains, propagation/association, BGP, firewalls, peering, appliance mode, cross-region links, quotas, and flow logs.

## Core knowledge
Transit centralizes routing but can centralize failure and cost. Segmentation must be encoded in route-domain design, not assumed from account ownership. Stateful inspection requires symmetric paths.

## Procedure
1. Classify attachments by trust and connectivity domain.
2. Define route-table/domain boundaries.
3. Specify propagation and association explicitly.
4. Design hybrid and inter-region attachment strategy.
5. Insert inspection only where policy requires it.
6. Validate symmetric routing through stateful appliances.
7. Forecast route, attachment, bandwidth, and cost scale.
8. Automate attachment onboarding with guardrails.
9. Test allowed/denied paths and route withdrawal.
10. Monitor transit bytes, drops, route state, and saturation.

## Decision points
Centralize transit when scale/governance justify it; retain direct peering for latency-sensitive or isolated relationships when operationally simpler. Separate route domains when trust differs materially.

## Common failure patterns
One universal route table, accidental transitivity, centralized firewall bottlenecks, asymmetric appliance paths, hidden cross-zone/region charges, and uncontrolled route propagation.

## Verification
Prove segmentation, route correctness, failover, throughput, quota headroom, and cost assumptions using representative flows.

## Expected output
A transit route-domain model, attachment policy, inspection design, capacity/cost model, and verified connectivity matrix.

## Stop conditions
Stop if trust boundaries are undefined, provider quotas cannot support the design, or transit changes could create broad unintended connectivity without approval.