# Cost Governance Rules

## Purpose
Control warehouse spend without compromising correctness, reliability, or required service levels.

## Scope
Applies to compute, storage, data transfer, materialization, retention, concurrency, and workload scheduling costs.

## MUST
- Major cost changes MUST be supported by measured usage and attributed to workloads or data products where practical.
- Expensive recurring jobs MUST define business value, freshness requirement, and an owner.
- Retention and materialization decisions MUST account for storage, recomputation, compliance, and recovery needs.
- Cost optimizations MUST preserve required data quality and service objectives.

## MUST NOT
- MUST NOT reduce resilience, validation, or security controls solely to lower cost.
- MUST NOT treat unused reserved capacity as justification for inefficient design.

## SHOULD
- Prefer workload scheduling, pruning, incremental processing, and right-sizing before architectural rewrites.
- Teams SHOULD monitor unit-cost trends for critical data products.

## Exceptions
Temporary cost spikes require documented reason, owner, and review date.

## Verification
Inspect billing attribution, workload metrics, storage growth, scheduling configuration, and before/after cost evidence.