# CDN Load Testing

## Purpose
Validate CDN, shield, and origin behavior under realistic volume, cache states, and failure conditions without producing misleading results or unsafe load.

## When to use
Use before launches, migrations, major configuration changes, or capacity-sensitive events.

## Inputs
Expected RPS, object mix, cacheability, geographies, concurrency, origin capacity, test authorization.

## Context to inspect
Rate limits, WAF, cache warmness, shield topology, origin autoscaling, test IPs, monitoring, vendor policies.

## Core knowledge
A warm-cache test measures a different system from a cold-cache test. Traffic shape, key cardinality, geography, and connection reuse strongly influence CDN results.

## Procedure
1. Define success criteria and abort thresholds.
2. Model production request mix and cache-key distribution.
3. Separate warm-cache, cold-cache, and bypass scenarios.
4. Generate load from representative regions when possible.
5. Ramp gradually while watching edge and origin metrics.
6. Test purge/cold-start recovery and controlled component failures.
7. Record hit ratio, latency percentiles, errors, origin RPS, and bandwidth.
8. Stop at safety thresholds.
9. Analyze bottlenecks and rerun after fixes.

## Decision points
Use synthetic keys only when they model real cardinality. Do not infer origin capacity from warm-cache tests.

## Common failure patterns
Accidental DDoS-like tests, unrealistic single-object caching, no abort threshold, testing only median latency, and ignoring WAF/rate-limit effects.

## Verification
Confirm generated traffic matches the planned profile and that observed cache/origin behavior is internally consistent.

## Expected output
A reproducible test plan, measurements, bottlenecks, capacity conclusions, and remediation items.

## Stop conditions
Stop immediately on unexpected production impact, authorization ambiguity, provider policy violation, or abort-threshold breach.