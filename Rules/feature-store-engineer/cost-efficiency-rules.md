# Cost Efficiency Rules

## Purpose
Control feature-platform cost without sacrificing correctness, reliability, security, or required latency.

## Scope
Offline storage, online stores, compute, streaming, materialization frequency, caching, and retention.

## MUST
- Cost decisions MUST use measured workload and billing evidence where available.
- Retention and materialization frequency MUST be justified by consumer needs.
- Cost optimizations MUST be evaluated for effects on freshness, reproducibility, latency, and recovery.
- Expensive high-cardinality or high-frequency features MUST have documented value and ownership.
- Major architecture changes MUST document cost-performance trade-offs.

## MUST NOT
- MUST NOT reduce required redundancy solely to lower cost without risk approval.
- MUST NOT delete historical data needed for active reproducibility or compliance to save cost.
- MUST NOT claim savings from theoretical estimates when actual billing evidence is available.

## SHOULD
- Track cost per serving request, materialized feature set, or other meaningful unit.
- Prefer lifecycle policies for cold historical data when requirements allow.

## Exceptions
Temporary cost increases or reductions below target resilience require owner, duration, and risk record.

## Verification
Inspect billing data, storage growth, materialization schedules, retention policies, and trade-off records.