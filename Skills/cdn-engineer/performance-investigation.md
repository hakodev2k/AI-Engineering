# CDN Performance Investigation

## Purpose
Diagnose CDN latency regressions using evidence that separates client, edge, network, cache, shield, and origin causes.

## When to use
Use for increased TTFB, regional slowness, poor cache performance, or post-change regressions.

## Inputs
Latency metrics, request logs, traces, synthetic tests, RUM, change history, origin metrics.

## Context to inspect
DNS, protocol negotiation, POP selection, cache status, edge compute, shield, origin connection and application timing.

## Core knowledge
End-to-end latency is a chain. A senior investigation decomposes it before tuning and compares affected cohorts with healthy controls.

## Procedure
1. Define the regression window and affected users.
2. Compare RUM and synthetic evidence.
3. Segment by geography, ASN, POP, protocol, path, and cache status.
4. Decompose DNS, connect, TLS, edge, origin, and transfer timing.
5. Correlate with configuration and deployment changes.
6. Compare hits versus misses and shield hits versus origin fetches.
7. Form one falsifiable hypothesis at a time.
8. Reproduce with controlled requests.
9. Apply the smallest reversible fix.
10. Verify tail latency and error rates after change.

## Decision points
Optimize the dominant measured component; do not chase median improvements when the SLO problem is tail latency.

## Common failure patterns
Testing from one location, averaging hits and misses, assuming origin is slow, changing multiple variables, and ignoring packet loss or client network cohorts.

## Verification
Demonstrate before/after measurements across affected cohorts and confirm no correctness or error-rate regression.

## Expected output
A root-cause narrative, supporting measurements, corrective action, and verified performance delta.

## Stop conditions
Escalate when diagnosis requires provider network telemetry or production changes beyond authorized scope.