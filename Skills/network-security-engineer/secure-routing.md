# Secure Routing

## Purpose
Protect routing behavior from unauthorized path changes, leaks, hijacks, and insecure administrative practices.

## When to use
Use when deploying or reviewing dynamic routing, internet peering, WAN, cloud routing, or route-policy changes.

## Inputs
Topology, routing protocols, peers, prefixes, route policies, authentication settings, operational requirements.

## Context to inspect
BGP/OSPF configuration, route maps, prefix lists, redistribution, default routes, management access, telemetry.

## Core knowledge
Route preference, convergence, filtering, protocol authentication, RPKI concepts, route leaks, redistribution hazards, control-plane protection.

## Procedure
1. Inventory routing adjacencies and ownership.
2. Define allowed prefixes and direction.
3. Minimize redistribution boundaries.
4. Apply explicit import/export filters.
5. Protect routing sessions and management access.
6. Add maximum-prefix and anomaly safeguards where appropriate.
7. Validate failover paths.
8. Monitor route changes and unexpected origin/path behavior.

## Decision points
Use dynamic routing where convergence and scale justify complexity; static routing where simplicity is safer. Apply RPKI validation for internet routes when operationally supported.

## Common failure patterns
Permissive prefix acceptance, accidental default advertisement, uncontrolled redistribution, weak peer authentication, missing route-change monitoring.

## Verification
Compare received/advertised routes to policy, simulate peer failure, inspect convergence, and confirm unauthorized prefixes are rejected.

## Expected output
Hardened routing policy, validation evidence, monitoring requirements, rollback plan.

## Stop conditions
Stop if prefix ownership is uncertain, route changes could isolate production without tested recovery, or upstream policy is unknown.