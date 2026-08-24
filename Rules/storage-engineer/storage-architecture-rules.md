# Storage Architecture Rules

## Purpose
Ensure storage designs satisfy durability, availability, performance, operability, and cost requirements without hidden single points of failure.

## Scope
Applies to block, file, object, local, distributed, and cloud storage designs.

## MUST
- Storage architecture MUST start from explicit workload requirements: capacity, IOPS, throughput, latency, durability, availability, RPO, RTO, retention, and growth.
- Failure domains and dependency boundaries MUST be documented before production adoption.
- Critical design decisions MUST record alternatives, trade-offs, and operational consequences.
- Capacity and redundancy assumptions MUST include failure-state behavior, not only steady state.

## MUST NOT
- MUST NOT select storage technology solely from headline benchmarks or vendor defaults.
- MUST NOT introduce a production single point of failure without explicit risk acceptance.
- MUST NOT treat replication as equivalent to backup.

## SHOULD
- Prefer simple architectures whose failure modes can be tested and operated by the owning team.
- Prefer reversible migrations and standards-based interfaces where practical.

## Exceptions
Exceptions require documented context, evidence, risk, mitigation, verification, and approval from the accountable owner.

## Verification
Review architecture records, dependency maps, failure-domain diagrams, workload measurements, resilience tests, and recovery evidence.