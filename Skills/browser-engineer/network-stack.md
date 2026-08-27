# Network Stack

## Purpose
Design and troubleshoot browser networking across DNS, connections, HTTP, proxies, caching, authentication, and request lifecycle.

## When to use
Use for request failures, latency, protocol changes, proxy behavior, cache bugs, or connection management.

## Inputs
Network logs, URLs, headers, timing data, proxy/TLS configuration, reproduction environment.

## Context to inspect
Resolver, socket pools, TLS, HTTP versions, request priorities, cache, proxy, auth, redirects, cancellation.

## Core knowledge
Browser networking is highly concurrent and policy-sensitive. Connection reuse, multiplexing, caching, priorities, and proxy configuration interact with privacy and security boundaries.

## Procedure
1. Capture a complete network transaction trace.
2. Separate DNS, connect, TLS, request queue, server, transfer, and cache time.
3. Determine connection reuse and protocol negotiation.
4. Inspect proxy and authentication decisions.
5. Validate request cancellation and retry semantics.
6. Check cache key and freshness behavior.
7. Reproduce under cold and warm connection/cache states.
8. Test network changes, offline transitions, and partial failures.

## Decision points
Retry only idempotent or explicitly replay-safe operations. Reuse connections when origin/security rules permit. Prefer protocol-native multiplexing over ad-hoc parallelism.

## Common failure patterns
Unsafe request replay; connection leaks; cache key omissions; proxy bypass; priority inversion; retry storms; diagnosing server time as browser CPU time.

## Verification
Compare network traces before/after, run protocol and proxy tests, validate cancellation, and measure latency under realistic conditions.

## Expected output
A verified network fix or diagnosis with protocol-level evidence.

## Stop conditions
Escalate when certificate policy, enterprise proxy policy, or server-side behavior is outside authorized scope.