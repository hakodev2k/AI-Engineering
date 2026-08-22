# Network Security Rules
## Purpose
Control network exposure and trust boundaries.
## Scope
Virtual networks, subnets, routing, firewalls, load balancers, gateways, DNS, and private connectivity.
## MUST
- Inbound and outbound connectivity MUST be explicitly justified and restricted to required sources, destinations, ports, and protocols.
- Sensitive services MUST use private connectivity when exposure is unnecessary.
- Network changes affecting production reachability MUST include impact analysis and rollback steps.
## MUST NOT
- MUST NOT expose administrative or data-plane endpoints publicly by default.
- MUST NOT use unrestricted ingress or egress without documented necessity and approval.
## SHOULD
- Segment workloads by trust boundary and blast radius.
## Exceptions
Exceptions require threat analysis, compensating controls, expiry where possible, and approval.
## Verification
Inspect routes, firewall/security-group rules, public endpoints, flow logs, DNS, connectivity tests, and infrastructure diffs.