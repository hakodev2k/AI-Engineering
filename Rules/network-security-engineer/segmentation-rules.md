# Network Segmentation
## Purpose
Limit lateral movement and contain compromise.
## Scope
Zones, VLANs, subnets, VPC/VNet boundaries, microsegmentation, and service networks.
## MUST
- Segments MUST map to trust, function, and sensitivity boundaries.
- Inter-segment traffic MUST be explicitly justified and least-privileged.
- High-value assets MUST be isolated from general user and untrusted networks.
- Segmentation changes MUST be tested for intended and unintended reachability.
## MUST NOT
- Broad any-to-any rules MUST NOT be used without approved, time-bounded exception.
- Segmentation MUST NOT rely solely on naming conventions.
## SHOULD
- East-west controls SHOULD be enforced close to workloads where practical.
## Exceptions
Record business need, scope, duration, compensating controls, and owner approval.
## Verification
Use policy inspection, flow logs, reachability tests, packet tests, and periodic rule review.