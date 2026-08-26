# Cost and Capacity Rules

## Purpose
Balance delivery economics with sufficient resilience and performance headroom.

## Scope
Applies to bandwidth, requests, egress, edge compute, log volume, cache efficiency, commitments, and origin capacity.

## MUST
- Material CDN cost decisions MUST use measured traffic and billing dimensions.
- Capacity analysis MUST include peak traffic, cache-miss scenarios, failover, and growth assumptions.
- Cost optimizations MUST preserve explicit reliability, security, and performance requirements.
- Unexpected spend changes MUST be attributable to traffic, configuration, pricing, or anomaly evidence.

## MUST NOT
- MUST NOT reduce redundancy or protective capacity solely for cost without risk acceptance.
- MUST NOT optimize hit ratio by caching data that is unsafe or semantically incorrect to share.
- MUST NOT assume provider list price equals effective workload cost.

## SHOULD
- Track unit economics such as cost per delivered GB/request where useful.
- Forecast major launches and seasonal peaks.
- Evaluate origin egress and log ingestion alongside CDN charges.

## Exceptions
Temporary overprovisioning or higher-cost routing is acceptable for incidents, launches, or migrations when owner, duration, and exit criteria are documented.

## Verification
Review billing exports, traffic forecasts, hit ratio, origin egress, edge-compute usage, peak capacity tests, commitments, and post-change unit costs.