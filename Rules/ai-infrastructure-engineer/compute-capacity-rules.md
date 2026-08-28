# Compute Capacity Rules

## Purpose
Ensure AI workloads have sufficient, economical, and resilient compute capacity.

## Scope
Applies to GPU, accelerator, CPU, memory, quota, reservation, and cluster capacity decisions.

## MUST
- Capacity plans MUST be based on measured workload demand, concurrency, utilization, queue depth, and growth assumptions.
- Critical training and inference workloads MUST define headroom and exhaustion thresholds.
- Scarce accelerator allocation MUST be prioritized by documented business or research criticality.
- Capacity changes MUST consider failure domains and recovery requirements.

## MUST NOT
- MUST NOT approve capacity increases solely from anecdotal demand.
- MUST NOT run production-critical workloads with known single-pool exhaustion risk and no mitigation.
- MUST NOT claim adequate headroom without utilization evidence.

## SHOULD
- Long-running demand SHOULD use reservations or committed capacity when economically justified.
- Capacity forecasts SHOULD distinguish baseline, burst, and recovery demand.

## Exceptions
Exceptions require rationale, demand evidence, risk assessment, expiry, and accountable approval.

## Verification
Review utilization dashboards, queue metrics, quotas, reservation data, forecasts, and load-test evidence.