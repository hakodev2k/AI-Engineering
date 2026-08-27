# High Availability Rules

## Purpose
Define resilient cloud network patterns for critical service paths.

## Scope
Applies to redundant gateways, load balancers, DNS, transit components, private connectivity, VPNs, and regional dependencies.

## MUST
- Critical network paths MUST identify single points of failure and required redundancy.
- Redundant components MUST span independent failure domains where the platform supports it.
- Failover behavior MUST be validated with controlled tests before relying on it for production recovery.
- Recovery objectives MUST align with business impact and service dependencies.
- Shared network dependencies MUST have explicit ownership and documented recovery procedures.

## MUST NOT
- MUST NOT treat duplicate resources as proof of resilience without testing.
- MUST NOT introduce hidden dependencies that invalidate the intended redundancy model.
- MUST NOT rely on an untested recovery path for critical traffic.

## SHOULD
- Prefer automated failover based on observable health criteria.
- Periodically rehearse recovery procedures and record evidence.

## Exceptions
Exceptions require documented constraints, residual risk, recovery method, evidence, and approval.

## Verification
Review topology, failure-domain placement, health configuration, controlled failover results, recovery records, and dependency maps.