# Session Affinity and Consistent Hashing

## Purpose
Use affinity only when justified and design hashing that preserves locality without creating unacceptable hotspots or failover risk.

## When to use
Use for stateful sessions, caches, sharded backends, WebSockets, or locality-sensitive workloads.

## Inputs
Affinity key, key cardinality, backend count, session duration, state location, cache behavior, and failover requirements.

## Context to inspect
Inspect cookies, source-address distribution, authentication identity, application session storage, cache topology, and backend churn.

## Core knowledge
Affinity trades balancing freedom for locality. Source-IP affinity performs poorly behind NAT. Cookie affinity is application-friendly but changes client behavior. Consistent hashing limits remapping as membership changes but does not eliminate skew.

## Procedure
1. Prove the workload needs affinity.
2. Identify stable high-cardinality candidate keys.
3. Measure key-frequency skew.
4. Select cookie, header, source, or consistent-hash strategy.
5. Define expiration and failover behavior.
6. Model backend removal and addition.
7. Test hotspot and heavy-hitter scenarios.
8. Verify application correctness after remapping.
9. Monitor per-key and per-backend imbalance.
10. Document how affinity can be removed if state is externalized.

## Decision points
Prefer stateless services when feasible. Choose consistent hashing for cache or shard locality; cookie affinity for user-session routing; avoid source-IP affinity when clients aggregate behind proxies.

## Common failure patterns
Low-cardinality keys; permanent sticky cookies; affinity hiding unhealthy backends; no fallback on node loss; assuming hashing guarantees equal load.

## Verification
Measure remap percentage, utilization variance, session continuity, and recovery after backend churn.

## Expected output
A justified affinity strategy with key selection, expiry, failure behavior, and monitoring.

## Stop conditions
Escalate when the affinity key contains sensitive data, cardinality is insufficient, or application state cannot survive backend loss.