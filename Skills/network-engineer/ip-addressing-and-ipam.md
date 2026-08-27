# IP Addressing and IPAM

## Purpose
Create scalable, conflict-free IPv4/IPv6 addressing and authoritative IP address management.

## When to use
Use for network expansion, cloud adoption, acquisitions, IPv6 rollout, subnet redesign, or recurring address conflicts.

## Inputs
Existing prefixes, registries, site/region inventory, routing boundaries, growth forecasts, DHCP/static needs, cloud constraints, and DNS/IPAM systems.

## Context to inspect
Allocated and advertised space, overlapping ranges, subnet utilization, reservations, DHCP scopes, NAT dependencies, route summaries, and ownership metadata.

## Core knowledge
Address plans should encode topology only where it improves aggregation and operations. Preserve contiguous growth space. IPAM is the source of truth; spreadsheets become dangerous when multiple writers exist. IPv6 planning should avoid recreating IPv4 scarcity habits.

## Procedure
1. Inventory authoritative allocations and actual use.
2. Detect overlap, orphaned prefixes, and undocumented static addresses.
3. Define hierarchy by region, environment, site, function, or trust zone.
4. Reserve growth blocks before assigning individual subnets.
5. Size subnets from realistic endpoint and failure-domain needs.
6. Define DHCP, static, loopback, transit, VIP, and infrastructure conventions.
7. Plan route summarization boundaries.
8. Establish IPv6 prefix allocation and dual-stack transition rules when applicable.
9. Record owner, purpose, lifecycle, and routing/security metadata in IPAM.
10. Integrate provisioning with IPAM APIs where safe.
11. Reconcile observed state against source-of-truth state.

## Decision points
Use smaller subnets to constrain blast radius, but avoid fragmentation that destroys summarization. Prefer globally unique private addressing across interconnected estates when feasible. Choose dual stack when dependencies require IPv4; prefer IPv6-only only after validating DNS, applications, tooling, and translation requirements.

## Common failure patterns
Overlaps discovered during peering, exhausted cloud CIDRs, undocumented statics, duplicate DHCP service, prefixes allocated without growth space, NAT used to hide poor planning, and IPAM records that drift from reality.

## Verification
Confirm uniqueness, utilization, summarization, DHCP behavior, routing reachability, DNS integration, and IPAM reconciliation. Test representative provisioning and decommissioning workflows.

## Expected output
Address hierarchy, allocation policy, IPAM records, migration actions, utilization report, and conflict remediation plan.

## Stop conditions
Stop when ownership of a conflicting prefix cannot be established, renumbering affects unknown dependencies, or registry/provider changes require authorization.