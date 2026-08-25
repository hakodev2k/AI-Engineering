# Cloud Network Security
## Purpose
Apply consistent network-security controls to cloud-native connectivity.
## Scope
VPC/VNet, security groups, NACLs, gateways, private endpoints, peering, transit, and cloud firewalls.
## MUST
- Cloud reachability MUST be intentional, least-privileged, and traceable to workload need.
- Public exposure MUST be explicitly identified and reviewed.
- Peering and transit designs MUST account for transitive reachability and route propagation.
- Infrastructure policy changes MUST be reviewed and tested before production execution.
## MUST NOT
- Provider defaults MUST NOT be assumed secure for the workload context.
- Broad inbound administrative access MUST NOT be permitted.
## SHOULD
- Private service connectivity SHOULD be preferred when it materially reduces exposure.
## Exceptions
Require documented need, risk, approval, compensating controls, and expiry.
## Verification
Inspect IaC, effective routes, security policies, exposure inventory, flow logs, and reachability analysis.