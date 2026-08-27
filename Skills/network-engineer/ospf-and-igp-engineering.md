# OSPF and IGP Engineering

## Purpose
Build and troubleshoot deterministic interior routing with controlled convergence and failure domains.

## When to use
Use for OSPF deployment, area redesign, adjacency failures, route instability, convergence tuning, or redistribution review.

## Inputs
Topology, interface addressing, areas, LSDB/RIB/FIB state, metrics, timers, authentication, redistribution policy, and incident evidence.

## Context to inspect
Neighbor state, network type, MTU, area consistency, DR/BDR behavior, LSA types, SPF events, route preference, summarization, and external routes.

## Core knowledge
IGP correctness depends on adjacency, topology database consistency, SPF computation, and FIB installation. Areas limit flooding and computation; they should follow topology and operational boundaries rather than arbitrary device counts.

## Procedure
1. Define intended adjacencies and reachability.
2. Capture neighbor, LSDB, RIB, FIB, and interface baselines.
3. Validate physical/link state and IP reachability.
4. Check area, authentication, timers, network type, and MTU compatibility.
5. Inspect LSAs and SPF history for churn.
6. Verify costs express intended primary and backup paths.
7. Review summarization and default origination.
8. Audit redistribution boundaries for loops or route feedback.
9. Tune detection/convergence only after identifying the real failure mode.
10. Apply scoped changes and observe topology stability.
11. Test representative link/node failures.

## Decision points
Use a single area when scale and policy allow; introduce areas for meaningful flooding or topology boundaries. Prefer passive interfaces where adjacency is unnecessary. Avoid mutual redistribution unless tagging/filtering makes loop prevention explicit.

## Common failure patterns
MTU mismatch, duplicate router IDs, area mismatch, unstable links causing SPF storms, bad cost design, redistribution loops, missing summaries, overaggressive timers, and treating a RIB route as proof of forwarding.

## Verification
Confirm stable full adjacencies, expected LSDB entries, intended RIB/FIB paths, bounded convergence, no unexpected externals, and successful failure tests.

## Expected output
Stable IGP configuration, topology/area rationale, route evidence, convergence observations, and rollback instructions.

## Stop conditions
Escalate on unexplained LSDB divergence, persistent churn, broad redistribution impact, or any change that risks isolating the management plane.