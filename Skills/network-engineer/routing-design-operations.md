# Routing Design and Operations

## Purpose
Design, operate, and troubleshoot routing that converges predictably, limits blast radius, and expresses intended reachability.

## When to use
Use for BGP/OSPF/IS-IS design, route-policy changes, multi-site connectivity, cloud routing, route leaks, blackholes, or convergence incidents.

## Inputs
Topology, routing tables, protocol configuration, prefixes, policies, ASN/area design, path requirements, and failure scenarios.

## Context to inspect
Inspect RIB/FIB state, neighbors, advertisements, redistribution, summarization, ECMP, default routes, route reflectors, filters, timers, and telemetry.

## Core knowledge
Routing correctness depends on both topology and policy. Control-plane reachability does not prove forwarding-plane correctness. Redistribution and broad route acceptance increase accidental coupling.

## Procedure
1. Define intended reachability and preferred paths.
2. Inspect current adjacencies and route sources.
3. Trace representative prefixes end to end.
4. Identify policy, metric, preference, and redistribution effects.
5. Design filters and summarization.
6. Evaluate convergence and failure behavior.
7. Stage changes with explicit pre/post checks.
8. Test forwarding, not only protocol state.
9. Monitor churn, flaps, and unexpected advertisements.
10. Document routing intent and rollback.

## Decision points
Use dynamic routing when topology changes justify automation; static routes can be safer for small stable edges. Prefer explicit import/export policy and least-route exposure over permissive defaults.

## Common failure patterns
Route leaks, redistribution loops, asymmetric return paths, unfiltered defaults, hidden more-specific routes, unstable timers, and assuming an established neighbor means traffic works.

## Verification
Confirm expected prefixes and next hops, forwarding tests, failover convergence, route-policy counters, absence of unintended advertisements, and stable adjacencies.

## Expected output
A routing design or remediation with intended reachability, policies, validation evidence, and rollback.

## Stop conditions
Stop if route ownership is uncertain, a change can leak routes externally, or safe rollback and out-of-band access are unavailable.