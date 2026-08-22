# IP Addressing Rules

## Purpose
Keep address space unique, routable, auditable, and sustainable.

## Scope
IPv4, IPv6, subnet allocation, IPAM, DHCP, and static assignments.

## MUST
- Allocate addresses from an authoritative IPAM source and record owner, purpose, scope, and lifecycle.
- Check overlap before adding or changing prefixes.
- Size subnets using evidenced demand plus justified growth margin.
- Treat IPv6 as an explicit design concern where supported or required.

## MUST NOT
- Create undocumented static allocations or overlapping production prefixes.
- Reuse address space whose ownership or routing status is uncertain.

## SHOULD
- Aggregate prefixes and preserve allocation hierarchy where this reduces routing complexity.

## Exceptions
Emergency temporary allocations require an expiry, owner, collision check, and follow-up reconciliation.

## Verification
Inspect IPAM, DHCP/static configuration, route tables, overlap checks, and address-utilization reports.