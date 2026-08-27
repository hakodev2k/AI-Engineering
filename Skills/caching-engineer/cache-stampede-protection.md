# Cache Stampede Protection

## Purpose
Prevent concurrent misses or expirations from overwhelming authoritative dependencies.

## When to use
Use for hot keys, expensive fills, bursty traffic, synchronized expiration, or observed origin spikes.

## Inputs
Per-key request rate, fill latency, origin capacity, TTL distribution, concurrency model.

## Context to inspect
Inspect miss traces, hot-key metrics, lock/coalescing primitives, timeouts, and failure propagation.

## Core knowledge
Stampedes occur when many requests independently regenerate the same value. Techniques include request coalescing, single-flight, probabilistic early refresh, soft TTL, stale-while-revalidate, and distributed locks. Locks must not become a new availability bottleneck.

## Procedure
1. Identify hot keys and quantify miss fan-out.
2. Estimate worst-case concurrent fills.
3. Select local single-flight or distributed coordination based on topology.
4. Bound lock/coalescing wait time.
5. Add jitter or early refresh.
6. Serve bounded stale values during refresh when allowed.
7. Ensure lock owner failure releases progress safely.
8. Avoid retries that multiply fill load.
9. Test mass expiry and dependency slowness.
10. Monitor coalesced requests, wait time, stale serves, and origin concurrency.

## Decision points
Prefer single-flight within one process; distributed locking only when cross-node duplicate fills are materially harmful. Prefer stale-while-revalidate when freshness allows it.

## Common failure patterns
Global locks; lock TTL shorter than fill time; indefinite wait; synchronized TTL; every waiter retries independently; stale content without a hard limit.

## Verification
Load-test a hot expired key and prove origin concurrency remains bounded.

## Expected output
A measured stampede-control strategy with bounded waiting and failure behavior.

## Stop conditions
Stop if stale serving or coordination semantics cannot meet correctness requirements.