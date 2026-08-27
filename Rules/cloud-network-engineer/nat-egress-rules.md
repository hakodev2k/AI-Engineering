# NAT and Egress Rules

## Purpose
Control outbound connectivity, address translation, and dependency exposure.

## Scope
Applies to NAT gateways, egress proxies, public IPs, outbound routing, and centralized internet access.

## MUST
- Production egress paths MUST be explicitly defined, owned, and observable.
- NAT capacity and port exhaustion risk MUST be assessed for high-connection workloads.
- Outbound destinations requiring unrestricted internet access MUST have documented justification.
- Egress IP dependencies used by partners or allowlists MUST be tracked as public contracts.
- Changes to egress paths MUST include rollback and dependency validation.

## MUST NOT
- MUST NOT rely on ephemeral public IPs for stable partner allowlisting.
- MUST NOT expose inbound services merely to obtain outbound connectivity.
- MUST NOT assume NAT provides application-layer security.

## SHOULD
- Prefer controlled, centralized, or policy-enforced egress where operationally appropriate.
- Monitor connection counts, port allocation, failures, and outbound volume.

## Exceptions
Exceptions require documented technical constraint, security impact, expiry where temporary, and approval.

## Verification
Inspect effective routes, NAT resources, public IP allocation, flow logs, capacity metrics, and external dependency documentation.