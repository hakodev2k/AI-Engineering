# Application Connection Cutover

## Purpose
Move application database traffic to the target safely while controlling connection pools, routing, secrets, and mixed-version behavior.

## When to use
Use when applications, workers, reports, or integration services must change database endpoints.

## Inputs
Consumer inventory, connection configuration, secret management, pooling behavior, deployment topology, DNS/routing, retry policy, and rollback plan.

## Core knowledge
Changing an endpoint does not immediately move existing sessions. Long-lived pools, DNS caching, sidecars, jobs, and independently deployed consumers can keep writing to the old source.

## Procedure
1. Enumerate every database consumer from discovery evidence.
2. Define cutover order and compatibility window.
3. Provision target credentials and connectivity in advance.
4. Reduce DNS TTL only if DNS is part of the strategy and do so early enough.
5. Quiesce or drain writers as required.
6. Change configuration through normal deployment controls.
7. Recycle or drain connection pools deliberately.
8. Verify new sessions terminate on target.
9. Detect residual source connections and classify them.
10. Run consumer-specific smoke tests.
11. Keep reversal mechanics available through the rollback window.

## Decision points
Use staged consumer migration when read/write compatibility permits; use coordinated switch when mixed authority would violate invariants.

## Common failure patterns
Forgotten workers, stale pools, hard-coded endpoints, secrets changed too late, and relying on DNS TTL alone.

## Verification
Connection telemetry shows intended consumers on target and no unauthorized source writers remain.

## Expected output
A controlled consumer transition with connection-level evidence.

## Stop conditions
Stop when unknown source writers persist or consumers cannot operate correctly against target.