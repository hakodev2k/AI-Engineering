# DNS and DHCP

## Purpose
Protect name resolution and address allocation as foundational Windows infrastructure.

## Scope
DNS zones, records, forwarding, dynamic updates, DHCP scopes, reservations, options, failover, and integrations.

## MUST
- DNS and DHCP changes MUST identify affected clients, dependencies, propagation behavior, and rollback.
- Authoritative zones and DHCP configuration MUST have recoverable configuration or backups.
- Dynamic updates MUST be secured where identity-aware updates are supported.
- Scope exhaustion, DNS failures, replication failures, and stale-record conditions MUST be observable.
- Destructive zone, scope, or bulk-record changes MUST require human approval.

## MUST NOT
- MUST NOT delete records solely because they appear stale without checking ownership and dependencies.
- MUST NOT introduce conflicting DHCP servers or overlapping scopes.
- MUST NOT expose internal DNS data publicly without an explicit architecture decision.

## SHOULD
- Use redundant resolvers and DHCP services for critical networks.
- Maintain deliberate TTL values based on change frequency and recovery needs.

## Exceptions
Document reason, blast radius, evidence, rollback, and approval.

## Verification
Validate authoritative and recursive resolution, replication, leases, failover state, scope utilization, event logs, and representative client renewal/resolution.