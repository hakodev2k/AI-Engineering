# Routing Safety Rules

## Purpose
Prevent automation from introducing route leaks, reachability loss, loops, or control-plane instability.

## Scope
BGP, IGPs, static routing, route policy, redistribution, attributes, and routing identifiers.

## MUST
- Routing changes MUST validate intended prefixes, peers, policy direction, and propagation boundaries.
- External advertisements MUST be constrained by explicit allow policy appropriate to the environment.
- Redistribution changes MUST analyze loop prevention and route feedback paths.
- Broad route-policy changes MUST be canaried or staged with route-table verification.
- Automation MUST preserve management reachability or provide an approved alternate recovery path.

## MUST NOT
- MUST NOT deploy an unconstrained permit-all export where explicit routing policy is required.
- MUST NOT change ASNs, router IDs, redistribution, default routing, or route-reflector relationships without impact analysis.
- MUST NOT infer successful routing solely from configuration acceptance.

## SHOULD
- Policy tests SHOULD use representative accepted and rejected route fixtures.
- Route-count and adjacency baselines SHOULD gate risky rollouts.

## Exceptions
Temporary broad policy requires incident or migration justification, bounded duration, monitoring, rollback, and explicit network owner approval.

## Verification
Run policy unit tests, compare RIB/FIB and adjacency state, validate advertised/received routes, inspect route counts, and verify representative end-to-end reachability.