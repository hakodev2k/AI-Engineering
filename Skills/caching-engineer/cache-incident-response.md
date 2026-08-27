# Cache Incident Response

## Purpose
Diagnose and mitigate production cache incidents while protecting authoritative dependencies and preserving evidence.

## When to use
Use for latency spikes, error surges, eviction storms, stale data, node loss, connection exhaustion, or origin overload linked to caching.

## Inputs
Incident timeline, dashboards, logs, traces, deployment history, topology, runbooks.

## Context to inspect
Inspect user impact, cache/client metrics, origin health, recent config/deploy changes, failover events, memory, network, connections, hot keys, and invalidation lag.

## Core knowledge
Cache incidents often cascade: a cache problem causes misses, misses overload origin, retries amplify both. Mitigation must control load before pursuing perfect diagnosis. Destructive flushes are high-risk because they create cold-cache storms.

## Procedure
1. Establish impact, start time, and affected paths.
2. Freeze unrelated changes.
3. Check cache availability, latency, errors, memory, evictions, replication, and connections.
4. Correlate with origin load and application retries.
5. Identify recent changes and skew/hot keys.
6. Apply the smallest reversible mitigation: rate limit, reduce retries, isolate bad nodes, extend safe stale serving, or roll back.
7. Avoid global flush unless explicitly justified and origin capacity is protected.
8. Monitor recovery and secondary effects.
9. Preserve evidence and timeline.
10. Perform root-cause analysis and add regression/fault tests.

## Decision points
Prioritize origin protection when miss amplification threatens system-wide availability. Prefer rollback over live tuning when a recent change has strong causal evidence.

## Common failure patterns
Flushing everything; increasing retries; focusing only on cache nodes; ignoring source saturation; changing multiple variables simultaneously; declaring recovery before hit ratio stabilizes.

## Verification
Confirm user SLO recovery, cache health, origin headroom, and no continuing stale/correctness issue.

## Expected output
Mitigated incident, evidence-backed RCA, and preventive actions.

## Stop conditions
Escalate when destructive actions, data exposure, or cross-service capacity decisions require additional authority.