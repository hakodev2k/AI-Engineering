# Cost and FinOps Rules

## Purpose
Make cloud cost an explicit architectural constraint without sacrificing required security, reliability, or performance.

## Scope
Applies to service pricing, resource sizing, data transfer, commitments, elasticity, storage lifecycle, and cost ownership.

## MUST
- Material architectures MUST estimate recurring cost using documented workload assumptions and major cost drivers.
- Cost models MUST include data transfer, storage growth, observability, backup, redundancy, support, and non-production environments when material.
- Expensive architectural changes MUST define expected value and measurable cost impact.
- Resources and shared services MUST have sufficient ownership metadata for cost allocation and investigation.
- Long-term financial commitments MUST be based on measured stable demand and require accountable approval.

## MUST NOT
- MUST NOT optimize cost by weakening mandatory security, recovery, or availability controls without explicit risk acceptance.
- MUST NOT present list-price estimates as guaranteed future spend.
- MUST NOT purchase long commitments solely from short-term utilization spikes.

## SHOULD
- Prefer elasticity, lifecycle policies, and rightsizing before architectural downsizing that harms objectives.
- Review unit economics for workloads whose demand scales with business usage.

## Exceptions
Exceptions require documented business rationale, cost exposure, risk, owner, and review date.

## Verification
Review billing data, architecture estimates, utilization, commitment coverage, unit-cost trends, allocation metadata, and post-change savings evidence.