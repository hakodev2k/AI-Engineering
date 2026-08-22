# Network Security Rules
## Purpose
Protect workload boundaries and minimize unintended network exposure.
## Scope
VPCs, subnets, routing, security groups, NACLs, endpoints, load balancers, DNS, and connectivity.
## MUST
- Classify subnets and ingress paths as public or private by design.
- Restrict inbound and outbound rules to justified protocols, ports, and sources.
- Review every internet-facing endpoint for authentication, TLS, filtering, logging, and ownership.
- Prefer private service connectivity when public routing is unnecessary.
## MUST NOT
- Open administrative ports to the internet without approved compensating controls.
- Treat a security group name as evidence that access is safe.
## SHOULD
- Segment workloads by trust boundary and failure domain.
- Use flow logs and reachability analysis for high-risk changes.
## Exceptions
Exceptions require threat analysis, exposure duration, compensating controls, owner, and approval.
## Verification
Inspect routes, security groups, NACLs, endpoints, DNS, load balancers, flow logs, and reachability tests.