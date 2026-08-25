# Control Plane
## Purpose
Protect the availability and integrity of mesh control-plane services.
## Scope
Control-plane topology, configuration distribution, upgrades, scaling, and recovery.
## MUST
- Control-plane capacity and availability MUST match the production failure model.
- Configuration distribution failures MUST be observable and alertable.
- Upgrades MUST have compatibility, rollback, and data-plane skew plans.
## MUST NOT
- MUST NOT perform irreversible control-plane changes without backup or recovery evidence.
- MUST NOT assume healthy control-plane pods imply successful configuration propagation.
- MUST NOT expose administrative endpoints broadly.
## SHOULD
- Critical control-plane components SHOULD avoid single-zone failure dependencies.
## Exceptions
Topology exceptions require documented availability risk and approval.
## Verification
Check health, propagation status, resource saturation, version skew, failover tests, and recovery procedures.