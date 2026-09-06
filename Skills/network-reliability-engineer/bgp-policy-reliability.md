# BGP Policy Reliability

## Purpose
Design and troubleshoot BGP policy so route exchange, path selection, and failure recovery remain predictable across providers, data centers, and cloud edges.

## When to use
Use for multi-homing, transit changes, route leaks, path instability, asymmetric routing, or BGP incident response.

## Inputs
Neighbor state, advertised/received prefixes, route maps/policies, communities, local preference, MED, AS paths, and RPKI status where applicable.

## Context to inspect
Inspect import/export policy, prefix limits, default-route behavior, route reflectors, communities, dampening, maximum-prefix thresholds, and upstream dependencies.

## Core knowledge
BGP is policy-driven, not shortest-path routing. Reliability depends on tight prefix control, explicit preference, safe failover, and blast-radius containment.

## Procedure
1. Define intended advertisements and preferred paths.
2. Compare actual received and advertised routes against policy.
3. Validate prefix filters and maximum-prefix controls.
4. Inspect local preference, AS-path prepending, MED, and communities.
5. Check route-reflector or transit dependencies.
6. Model primary-path failure and convergence.
7. Review RPKI/ROA implications where used.
8. Make the smallest policy change required.
9. Monitor path stability after rollout.

## Decision points
Prefer local preference for internal policy. Use AS-path prepending for coarse inbound influence only when upstream behavior is understood. Avoid relying on MED across unrelated networks.

## Common failure patterns
Unfiltered advertisements, accidental transit, brittle prepend assumptions, route leaks, inconsistent community semantics, and failover paths never tested.

## Verification
Confirm neighbor stability, expected best paths, exact advertisements, convergence behavior, and absence of unintended prefixes.

## Expected output
A verified BGP policy or diagnosis with clear failover semantics.

## Stop conditions
Escalate when changes could affect Internet-wide reachability or upstream policy is undocumented.