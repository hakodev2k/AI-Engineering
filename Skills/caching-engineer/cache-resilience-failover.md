# Cache Resilience and Failover

## Purpose
Ensure cache failures degrade predictably without cascading into origin, network, or application outages.

## When to use
Use when designing production caches, reviewing HA, or investigating cache-related incidents.

## Inputs
Availability SLO, origin capacity, topology, client timeout/retry policy, failover mechanism.

## Context to inspect
Inspect node/zone placement, replication, connection pools, DNS/service discovery, circuit breakers, and origin headroom.

## Core knowledge
A cache often protects a more expensive dependency. Failing open to origin can be more dangerous than the cache outage itself. Recovery can also cause cold-cache amplification. Resilience requires bounded timeouts, retry budgets, load shedding, warm-up strategy, and tested failover.

## Procedure
1. Enumerate cache failure modes.
2. Define per-operation timeout budgets.
3. Bound retries and add jitter.
4. Decide which requests may bypass cache during failure.
5. Protect origin with concurrency/rate limits.
6. Configure replication and failure domains.
7. Define cold-start and rewarming strategy.
8. Add circuit breaking where repeated cache calls waste budget.
9. Game-day node, zone, and full-cache loss.
10. Monitor failover time, origin load, and recovery hit ratio.

## Decision points
Fail open only when origin capacity and correctness permit it. Fail closed for flows where bypass creates unsafe load or security/correctness risk, with an explicit user-facing degradation plan.

## Common failure patterns
Long client timeouts; retry storms; all nodes in one zone; immediate unrestricted origin fallback; cache restart causing source collapse.

## Verification
Fault injection must show bounded latency and origin load under cache loss.

## Expected output
A tested cache-failure runbook and resilient client policy.

## Stop conditions
Stop if no safe degraded mode exists and service owners have not accepted the availability risk.