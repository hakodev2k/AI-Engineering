# Network Segmentation Rules

## Purpose
Limit blast radius and lateral movement by making network reachability narrow, intentional, and subordinate to identity-aware authorization.

## Scope
Applies to cloud networks, datacenters, Kubernetes networks, service meshes, remote access, administrative networks, and hybrid connectivity.

## MUST
- Network paths to sensitive resources MUST be explicitly defined and restricted to required sources, destinations, ports, and protocols.
- Segmentation boundaries MUST align with asset sensitivity, workload function, trust boundaries, and operational ownership.
- East-west traffic to high-value services MUST be subject to identity-aware controls where the platform supports them.
- Administrative planes MUST be separated from normal user and application traffic.
- Segmentation changes MUST be reviewed for unintended reachability and rollback before production deployment.
- Network policy MUST be observable through flow logs, enforcement telemetry, or equivalent evidence.

## MUST NOT
- Flat internal networks MUST NOT be treated as acceptable merely because perimeter controls exist.
- Broad any-to-any rules MUST NOT be introduced without documented, time-bounded exception approval.
- Security groups, firewall rules, or network policies MUST NOT be used as the sole authorization mechanism for sensitive application operations.
- Temporary troubleshooting rules MUST NOT remain indefinitely.

## SHOULD
- Microsegmentation SHOULD be introduced where it materially reduces lateral-movement risk without unacceptable operational fragility.
- Egress restrictions SHOULD be used for workloads that do not require unrestricted outbound access.
- Policy definitions SHOULD be managed as code and peer reviewed.

## Exceptions
Exceptions require exact scope, business need, threat impact, compensating controls, expiry, accountable owner, and approval.

## Verification
Inspect route tables, firewall rules, security groups, network policies, service-mesh policies, flow logs, and reachability tests. Validate allowed and denied paths from representative network locations.