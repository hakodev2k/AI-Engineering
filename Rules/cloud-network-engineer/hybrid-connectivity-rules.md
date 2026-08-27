# Hybrid Connectivity Rules

## Purpose
Control connectivity between cloud networks and external or on-premises environments.

## Scope
Applies to VPNs, dedicated circuits, virtual WANs, transit services, routing exchange, and hybrid failover.

## MUST
- Hybrid links MUST have documented owners, capacity, encryption, routing policy, and failover behavior.
- BGP advertisements MUST be filtered to approved prefixes.
- Redundant connectivity MUST be tested for actual failover, not assumed from configuration alone.
- MTU, fragmentation, asymmetric routing, and NAT behavior MUST be validated where relevant.
- Changes affecting shared hybrid paths MUST include stakeholder review and rollback.

## MUST NOT
- MUST NOT accept unrestricted external route advertisements.
- MUST NOT depend on a single untested tunnel for critical production traffic.
- MUST NOT bypass encryption requirements to simplify troubleshooting.

## SHOULD
- Prefer diverse failure domains for redundant links.
- Monitor tunnel status, packet loss, latency, route changes, and utilization.

## Exceptions
Exceptions require documented business constraints, risk, compensating controls, and approval.

## Verification
Review routing policy, BGP state, tunnel/circuit health, failover tests, monitoring, and architecture records.