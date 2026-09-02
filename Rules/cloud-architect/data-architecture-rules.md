# Data Architecture Rules

## Purpose
Ensure cloud data architecture preserves ownership, integrity, confidentiality, lifecycle requirements, and operability across services and regions.

## Scope
Applies to operational databases, analytical stores, object storage, caches, replicas, data movement, and data residency choices.

## MUST
- Every authoritative dataset MUST have a documented owner, system of record, classification, retention requirement, recovery requirement, and permitted access pattern.
- Storage technology MUST be selected from workload evidence including consistency, transaction, latency, throughput, scale, query, durability, and operational requirements.
- Data movement across services, regions, or jurisdictions MUST identify security, residency, latency, consistency, and cost implications.
- Replication and caching designs MUST explicitly define acceptable staleness and conflict behavior.
- Schema or storage changes that risk data loss or incompatibility MUST have a tested migration and recovery strategy before execution.

## MUST NOT
- MUST NOT duplicate authoritative data without defining synchronization and ownership semantics.
- MUST NOT use a data store outside its supported consistency or durability guarantees while claiming stronger behavior.
- MUST NOT retain sensitive data indefinitely by default.

## SHOULD
- Prefer clear domain ownership and explicit contracts over shared mutable stores.
- Minimize unnecessary data movement and cross-region transfer.

## Exceptions
Exceptions require documented requirement, alternatives, data risk, security and compliance impact, recovery approach, and accountable approval.

## Verification
Review data-flow diagrams, classifications, schemas, retention policy, replication settings, migration tests, recovery evidence, and access controls.