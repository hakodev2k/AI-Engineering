# Private Service Connectivity

## Purpose
Connect consumers to managed or internal services privately without unnecessary public exposure or broad network peering.

## When to use
Use for private endpoints, PrivateLink-style services, service endpoints, cross-account service publishing, or migration from public service access.

## Inputs
Consumer networks, service ownership, supported endpoint mechanisms, DNS names, ports, identity controls, throughput, availability, and cost constraints.

## Preconditions
Confirm the provider/service supports the required private-connectivity model and understand its DNS behavior.

## Context to inspect
Endpoint policies, private DNS zones, endpoint ENIs/interfaces, routing, security groups/firewalls, service load balancers, IAM, quotas, and flow logs.

## Core knowledge
Private connectivity reduces exposure but does not replace authentication/authorization. Endpoint-based models can avoid transitive routing and CIDR overlap problems, while peering exposes broader network reachability. DNS integration is often the decisive operational detail.

## Procedure
1. Define the minimum consumer-to-service flow.
2. Compare endpoint, peering, transit, and public-with-controls options.
3. Choose the narrowest mechanism satisfying scale and availability.
4. Configure service-side acceptance and consumer endpoints.
5. Integrate private DNS deliberately.
6. Apply network and identity policies.
7. Validate multi-zone placement and quotas.
8. Test resolution, connection, denial, failover, and throughput.
9. Monitor endpoint health, bytes, errors, and cost.
10. Document onboarding/offboarding procedures.

## Decision points
Prefer service-specific private endpoints for narrow producer/consumer relationships; use peering/transit when many bidirectional flows require general network connectivity.

## Common failure patterns
Assuming private means authorized, DNS still resolving public addresses, single-zone endpoints, endpoint-policy omissions, hidden per-byte costs, and broad peering for one service.

## Verification
Confirm traffic uses private addresses/path, unauthorized consumers are denied, DNS is correct, zone failure is tolerated, and throughput/cost meet expectations.

## Expected output
A least-connectivity design, endpoint/DNS/security configuration, evidence, and lifecycle runbook.

## Stop conditions
Stop when service support is unclear, identity ownership is missing, or migration would remove the only working path without rollback.