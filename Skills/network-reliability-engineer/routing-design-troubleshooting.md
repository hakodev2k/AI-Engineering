# Routing Design and Troubleshooting

## Purpose
Design and diagnose routing behavior across static routes, dynamic routing domains, cloud route tables, and hybrid networks.

## When to use
Use for route leaks, blackholes, asymmetric paths, unstable convergence, connectivity changes, or hybrid routing design.

## Inputs
Routing tables, BGP/OSPF state, prefixes, policies, path traces, topology, cloud route tables, and change history.

## Context to inspect
Inspect route origin, administrative preference, metrics, advertisements, filtering, redistribution, summarization, ECMP, and failure behavior.

## Core knowledge
Routing correctness depends on policy, reachability, convergence, and failure isolation. More-specific routes, redistribution, and asymmetric paths are common sources of production incidents.

## Procedure
1. Define expected source-to-destination path.
2. Trace route selection at each hop.
3. Compare control-plane routes with forwarding-plane behavior.
4. Inspect advertisements and filters.
5. Check more-specific and default-route interactions.
6. Identify redistribution or summarization hazards.
7. Validate failover and convergence behavior.
8. Apply the smallest safe corrective change.
9. Record route-policy rationale.

## Decision points
Use dynamic routing for changing multi-path environments; use static routing for simple stable paths. Summarize only where reachability semantics remain correct.

## Common failure patterns
Route leaks, accidental default-route propagation, stale static routes, mutually recursive routes, asymmetric stateful-firewall paths, and unbounded redistribution.

## Verification
Confirm forwarding paths, route stability, expected advertisements, failover, and absence of unintended prefix reachability.

## Expected output
A verified routing diagnosis or design with explicit policy and failure behavior.

## Stop conditions
Escalate if changing routing may create broad reachability loss or if authoritative ownership of advertised prefixes is unclear.