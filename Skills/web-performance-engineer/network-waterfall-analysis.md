# Network Waterfall Analysis

## Purpose
Use browser network evidence to identify request ordering, protocol, connection, transfer, caching, and dependency problems that delay user journeys.

## When to use
Use for slow startup, late LCP resources, excessive requests, origin latency, redirect chains, cache misses, or unexplained resource stalls.

## Inputs
HAR or browser waterfall, server timing, resource priorities, cache headers, DNS/TLS timings, CDN metadata.

## Context to inspect
Record cold and warm cache cases, target geography, protocol version, connection reuse, service-worker behavior, authenticated state, and third-party origins.

## Core knowledge
Waterfalls show causality in discovery and dependency ordering but require interpretation. Queueing, connection setup, server wait, content download, priority, redirects, and cache policy each demand different remedies.

## Procedure
1. Mark the navigation and user-visible completion milestone.
2. Identify the requests on its critical dependency chain.
3. Inspect redirects, DNS/TCP/TLS, TTFB, queueing, and transfer separately.
4. Find late discovery and incorrect priority.
5. Check connection reuse and unnecessary origin proliferation.
6. Validate compression and cache behavior.
7. Examine request duplication and speculative loading.
8. Correlate server timing where backend delay is significant.
9. Change the dominant bottleneck rather than the largest resource by default.
10. Re-run cold and warm scenarios and compare timelines.

## Decision points
Use preconnect when handshake latency and certainty justify it; preload only critical resources. Consolidate origins only when operational trade-offs do not outweigh connection benefits. Prefer cache fixes over compression work for repeatedly fetched immutable assets.

## Common failure patterns
Reading size as latency; ignoring queueing; excessive preconnects; treating cached and uncached runs as comparable; missing service-worker interception; blaming network for CPU-delayed requests.

## Verification
Confirm earlier critical-resource completion, reduced connection/request overhead, correct cache semantics, and improved user metric.

## Expected output
An annotated critical waterfall with ranked causes and verified remediation.

## Stop conditions
Escalate when upstream service or CDN ownership is required and evidence shows the browser is not the limiting layer.