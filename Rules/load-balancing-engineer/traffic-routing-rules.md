# Traffic Routing Rules

## Purpose
Ensure traffic-routing decisions preserve availability, correctness, and predictable failure behavior.

## Scope
Applies to L4/L7 load balancers, ingress tiers, proxies, gateways, global traffic managers, and service-routing policies.

## MUST
- Routing policy MUST define the intended algorithm, eligible backends, health dependency, failover behavior, and capacity assumptions.
- Changes MUST be evaluated for blast radius, convergence behavior, and interaction with retries, connection reuse, and autoscaling.
- Stateful or affinity-dependent routing MUST document the state dependency and recovery behavior when the selected backend disappears.
- Critical routing changes MUST have rollback or traffic-shift reversal procedures before execution.

## MUST NOT
- MUST NOT route production traffic to an unverified backend pool.
- MUST NOT use client-visible attributes for routing when they can be spoofed unless they are validated by a trusted boundary.
- MUST NOT assume equal backend capacity when instances materially differ.

## SHOULD
- Prefer simple, explainable algorithms unless measurements demonstrate a need for adaptive routing.
- Prefer gradual traffic shifts for material routing changes.

## Exceptions
Exceptions require documented constraints, risk, evidence, verification steps, and approval when production impact is possible.

## Verification
Inspect configuration diffs, backend eligibility, health state, traffic distribution metrics, error rates, latency percentiles, and rollback tests. Use controlled canary traffic where practical.