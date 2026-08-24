# Capacity Planning Rules

## Purpose
Prevent exhaustion, emergency expansion, and waste through evidence-based storage capacity planning.

## Scope
Capacity, metadata, inode/object counts, snapshots, journals, reserves, and growth headroom.

## MUST
- Capacity forecasts MUST use measured consumption trends and known demand changes.
- Alert thresholds MUST leave enough lead time to expand safely under expected growth.
- Usable capacity MUST account for replication, erasure coding, snapshots, metadata, reserved space, and failure headroom.
- Expansion plans for critical systems MUST be tested before thresholds become urgent.

## MUST NOT
- MUST NOT plan from raw device capacity when usable capacity differs.
- MUST NOT run critical pools at utilization levels that materially impair recovery or rebalancing.
- MUST NOT assume historical growth alone captures announced migrations or launches.

## SHOULD
- Track capacity by failure domain, tenant, tier, and workload where useful.
- Review forecast error and tune planning horizons periodically.

## Exceptions
Reduced headroom requires quantified risk, expiry, mitigation, and accountable approval.

## Verification
Inspect dashboards, forecasts, utilization trends, expansion lead times, alert thresholds, and post-expansion evidence.