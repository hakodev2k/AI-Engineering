# Multi-Cluster Mesh
## Purpose
Preserve identity, routing, and failure isolation across clusters.
## Scope
Cross-cluster discovery, gateways, trust, failover, locality, and network partitions.
## MUST
- Cross-cluster trust relationships MUST be explicit and reviewed.
- Failover destinations MUST have verified capacity and compatible service/data semantics.
- Partition behavior MUST be defined for control and data planes.
## MUST NOT
- MUST NOT assume clusters share identical policy, DNS, or network behavior.
- MUST NOT enable automatic failover without testing dependency and capacity consequences.
- MUST NOT expand trust domains implicitly during federation.
## SHOULD
- Locality-aware routing SHOULD minimize unnecessary cross-region latency and cost.
## Exceptions
Cross-cluster shortcuts require documented risk, owner, and approval.
## Verification
Run partition, failover, identity, routing, latency, and capacity tests across cluster boundaries.