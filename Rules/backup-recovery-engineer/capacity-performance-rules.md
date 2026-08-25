# Capacity and Performance

## Purpose
Ensure backup and restore infrastructure can meet retention and recovery objectives under realistic load.

## Scope
Repository capacity, network bandwidth, ingest, restore throughput, concurrency, deduplication, compression, and growth.

## MUST
- Capacity planning MUST include data growth, retention, change rate, headroom, and failure/rebuild scenarios.
- Restore throughput MUST be measured for critical recovery paths.
- Performance claims MUST use before/after or representative measurements.
- Capacity thresholds MUST provide enough lead time for safe remediation.

## MUST NOT
- MUST NOT optimize backup ingest at the expense of required restore performance without explicit trade-off approval.
- MUST NOT rely solely on nominal vendor throughput.
- MUST NOT delete required recovery points as an unapproved capacity workaround.

## SHOULD
- Forecasts SHOULD use observed trends and scenario ranges rather than a single-point estimate.
- Tests SHOULD include concurrent restores where disaster scenarios require them.

## Exceptions
Temporary objective risk requires documented duration, impact, mitigation, owner, and approval.

## Verification
Review utilization trends, forecasts, benchmark results, restore throughput, network constraints, capacity alerts, and remediation lead times.