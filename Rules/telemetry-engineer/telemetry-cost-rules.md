# Telemetry Cost Rules

## Purpose
Control telemetry spend without degrading required reliability, security, or diagnostic capability.

## Scope
Ingestion volume, indexing, storage, query cost, retention, sampling, and egress.

## MUST
- Material telemetry costs MUST be attributable to signal type, producer, environment, or another actionable ownership dimension.
- Cost optimizations MUST evaluate effects on detection, debugging, compliance, and analytical accuracy.
- High-cost fields, indexes, or retention policies MUST have documented value.
- Cost anomalies MUST trigger investigation using measured volume and backend billing evidence.

## MUST NOT
- MUST NOT remove critical security or incident signals solely to reduce cost without risk approval.
- MUST NOT claim savings without before/after measurements.
- MUST NOT optimize storage while shifting greater unmeasured cost to queries or egress.

## SHOULD
- Prefer tiering, aggregation, or targeted sampling before discarding high-value diagnostic evidence.

## Exceptions
Require documented trade-off, affected consumers, risk, evidence, and approval for material impact.

## Verification
Review billing data, volume dashboards, index usage, retention policy, and before/after measurements.