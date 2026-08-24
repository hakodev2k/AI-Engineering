# Workload Placement
## Purpose
Place computation deliberately across device, edge, regional, and central tiers.
## Scope
All edge workloads and placement changes.
## MUST
- Placement MUST be justified by latency, availability, data locality, privacy, bandwidth, cost, and operational constraints.
- Critical dependencies and failure behavior MUST be documented before rollout.
- Placement decisions MUST use measured workload and network evidence where available.
## MUST NOT
- MUST NOT move workloads to edge nodes solely because lower latency is assumed.
- MUST NOT create an undocumented dependency on a single site or control plane.
## SHOULD
- Workloads SHOULD degrade safely when upstream connectivity is unavailable.
## Exceptions
Exceptions require rationale, evidence, risk, rollback, and accountable approval.
## Verification
Review architecture records, latency measurements, dependency maps, failure tests, and deployment configuration.