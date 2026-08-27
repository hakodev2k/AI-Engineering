# Origin Shielding

## Purpose
Use a controlled intermediate cache tier to collapse misses, reduce origin fan-out, and stabilize origin traffic.

## When to use
Use when many edge POPs miss independently, origins are capacity-sensitive, or long-haul origin connections are expensive.

## Inputs
Edge miss rate, origin geography, request distribution, object sizes, shield locations, origin capacity and latency.

## Context to inspect
Current cache hierarchy, routing, shield bypasses, failover, cache keys, request coalescing, metrics.

## Core knowledge
A shield trades an extra hop on misses for higher aggregate cache reuse and fewer origin connections. Poor placement can increase latency or create a concentrated failure domain.

## Procedure
1. Quantify current origin requests by POP and object.
2. Estimate miss collapse achievable at a shield.
3. Select shield region near origin/network interconnects.
4. Ensure cache semantics are consistent between edge and shield.
5. Configure request collapsing where supported.
6. Define shield failure bypass behavior.
7. Capacity-plan origin for shield bypass.
8. Compare latency, origin RPS, and hit ratios before and after.
9. Test shield outage and regional degradation.

## Decision points
Use one shield for concentrated origins; consider regional shields for geographically distributed origins. Do not shield traffic that cannot benefit from shared caching unless connection aggregation alone justifies it.

## Common failure patterns
Shield too far from origin, double-cache semantic mismatch, hidden single point of failure, bypass storms, and no visibility into shield hit ratio.

## Verification
Measure shield hit ratio, origin offload, tail latency, connection counts, and behavior during shield bypass.

## Expected output
A shield topology and policy with quantified benefits, failure handling, and operational metrics.

## Stop conditions
Escalate when shielding worsens SLOs, creates unacceptable concentration risk, or origin capacity cannot tolerate bypass.