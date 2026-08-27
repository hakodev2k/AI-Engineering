# Cloud Routing Design

## Purpose
Design and troubleshoot deterministic cloud routing across subnets, gateways, transit fabrics, regions, and hybrid networks.

## When to use
Use for new connectivity, route-scale changes, asymmetric-path incidents, black holes, unexpected reachability, or transit redesign.

## Inputs
Topology, route tables, propagated routes, BGP advertisements, prefixes, appliance placement, desired traffic flows, and provider route-selection rules.

## Preconditions
Capture current effective routes from the cloud control plane and relevant network devices.

## Context to inspect
Static routes, propagated routes, route priorities, BGP attributes, transit gateways/route servers, NAT/firewalls, peering, VPN/private circuits, and return paths.

## Core knowledge
Cloud routing combines provider-specific precedence with IP longest-prefix match and, in hybrid cases, BGP policy. Reachability is bidirectional: a valid forward path does not prove a valid return path. Stateful middleboxes make asymmetry operationally significant.

## Procedure
1. Define the intended source-to-destination path.
2. Enumerate effective routes hop by hop in both directions.
3. Check longest-prefix and provider-specific priority rules.
4. Inspect propagation and BGP advertisements.
5. Identify overlapping or more-specific prefixes.
6. Account for NAT and stateful appliances.
7. Verify symmetry where required.
8. Evaluate route limits and convergence behavior.
9. Remove unnecessary route exceptions.
10. Test normal, failover, and withdrawal scenarios.
11. Document route ownership and change controls.

## Decision points
Prefer dynamic routing for changing hybrid/transit domains when convergence is understood; prefer static routes for small, stable, tightly controlled paths. Use more-specific routes only when the operational consequences are explicit.

## Common failure patterns
Assuming peering is transitive, forgetting return routes, accidental default-route capture, route propagation into the wrong domain, asymmetric firewall paths, and route-table drift.

## Verification
Validate effective routes, packet path, return path, failover convergence, forbidden reachability, and route-count headroom. Use flow logs or packet captures when control-plane state is insufficient.

## Expected output
A verified routing model, route changes, evidence of reachability/denial, and documented failover behavior.

## Stop conditions
Stop when route changes could disconnect production without an approved rollback, provider route precedence is ambiguous, or required device/control-plane access is unavailable.