# DNS and DHCP Rules

## Purpose
Protect foundational naming and address-assignment services.

## Scope
Authoritative and recursive DNS, zones, records, DHCP scopes, reservations, relay, and lifecycle.

## MUST
- Define authoritative ownership and change control for production zones and DHCP scopes.
- Validate record TTL, dependency, propagation, and rollback implications before critical DNS changes.
- Prevent conflicting DHCP scopes and unauthorized address assignment.
- Monitor service availability, exhaustion, and resolution failures.

## MUST NOT
- Use DNS changes as undocumented permanent routing or failover mechanisms.
- Delete critical records or scopes without dependency review and recovery plan.

## SHOULD
- Automate record and lease lifecycle with auditable sources of truth.

## Exceptions
Emergency changes require bounded scope, evidence, monitoring, and retrospective reconciliation.

## Verification
Inspect authoritative configuration, resolution tests, DHCP utilization, audit logs, monitoring, and rollback evidence.