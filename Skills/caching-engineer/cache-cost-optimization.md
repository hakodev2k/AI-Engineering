# Cache Cost Optimization

## Purpose
Reduce cache infrastructure and data-transfer cost without sacrificing latency, availability, or origin protection.

## When to use
Use for cost reviews, low utilization, expensive managed caches, excessive replication, or poor cache economics.

## Inputs
Infrastructure bill, hit/miss data, object sizes, origin cost, SLOs, traffic geography.

## Context to inspect
Inspect node utilization, reserved capacity, replication, cross-zone/region traffic, idle namespaces, TTLs, compression, and origin cost per miss.

## Core knowledge
Cache value is economic as well as technical: saved origin compute/database work and latency must exceed cache memory/network/operations and complexity. Removing cache can increase downstream cost. Optimize total request-path cost, not the cache line item alone.

## Procedure
1. Attribute cache spend by cluster/namespace where possible.
2. Quantify cost avoided per hit.
3. Identify underutilized capacity and low-value namespaces.
4. Evaluate right-sizing while preserving failover headroom.
5. Tune TTL/admission for valuable reuse.
6. Evaluate compression for large values including CPU cost.
7. Reduce unnecessary replication or cross-region traffic only within resilience requirements.
8. Consider tiering/locality changes.
9. Load-test proposed downsizing.
10. Compare total system cost and SLO after change.

## Decision points
Remove caching where reuse is too low and origin cost is trivial. Retain seemingly expensive cache where it prevents substantially larger database/compute scaling.

## Common failure patterns
Optimizing monthly cache bill alone; removing failover headroom; compressing tiny values; extending TTL beyond freshness limits; ignoring egress.

## Verification
Measure total end-to-end cost, SLO, origin utilization, and failure headroom before and after.

## Expected output
A quantified optimization with no unaccepted reliability or correctness regression.

## Stop conditions
Stop when cost attribution is insufficient to distinguish savings from shifted downstream spend.