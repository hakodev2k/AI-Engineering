# Data Locality Rules

## Purpose
Minimize avoidable transfer cost, latency, and compliance risk when moving data to AI compute.

## Scope
Applies to dataset placement, cache placement, cross-region transfer, residency constraints, and training or inference data paths.

## MUST
- Data placement decisions MUST consider workload locality, transfer volume, latency, cost, durability, and residency requirements.
- Restricted data MUST remain within approved locations and access boundaries.
- Large recurring transfers MUST be measured and reviewed for locality optimization.
- Cache invalidation and freshness behavior MUST be defined when copies are placed near compute.

## MUST NOT
- MUST NOT replicate restricted datasets across regions or tenants without authorization.
- MUST NOT optimize locality by creating unmanaged copies with unclear ownership or retention.
- MUST NOT assume network transfer is negligible for high-volume training workloads.

## SHOULD
- Frequently reused immutable data SHOULD be cached near compute when economically justified.
- Data placement SHOULD align with the expected compute lifecycle.

## Exceptions
Exceptions require data-owner approval, residency analysis, cost and performance evidence, retention plan, and expiry.

## Verification
Inspect dataset locations, transfer telemetry, residency policy, cache configuration, copy inventories, access controls, and retention records.