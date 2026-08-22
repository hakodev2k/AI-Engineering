# Switching and VLAN Design

## Purpose
Build Layer 2 domains that provide required local connectivity while controlling loops, broadcast scope, operational complexity, and failure propagation.

## When to use
Use for campus/data-center switching, VLAN redesign, trunk changes, STP incidents, access-layer expansion, or L2 migration.

## Inputs
Physical topology, VLAN inventory, endpoint requirements, trunk/access configuration, STP state, redundancy design, and traffic patterns.

## Context to inspect
Inspect switch roles, trunks, allowed VLANs, native VLANs, STP roots, port channels, MAC tables, loop protections, and management access.

## Core knowledge
Layer 2 should be bounded deliberately. STP protects against loops but is not a substitute for clear topology. VLANs provide segmentation boundaries only when Layer 3 policy enforces separation.

## Procedure
1. Map physical links and L2 domains.
2. Identify required endpoint adjacency.
3. Minimize VLAN span across failure domains.
4. Define trunks and allowed VLANs explicitly.
5. Set deterministic STP root placement and protections.
6. Design link aggregation consistently.
7. Validate gateway placement and inter-VLAN routing.
8. Stage changes and protect management connectivity.
9. Test loop prevention and failover.

## Decision points
Prefer routed access when operational model and hardware support it; use stretched VLANs only for concrete requirements. Choose MLAG/stacking based on failure independence and operational trade-offs.

## Common failure patterns
VLANs allowed everywhere, accidental native-VLAN mismatches, poor STP root placement, loops from unmanaged links, giant broadcast domains, and assuming VLAN separation equals security.

## Verification
Check STP topology, trunk consistency, MAC learning, gateway reachability, redundancy behavior, broadcast levels, and management access after changes.

## Expected output
A bounded L2 design with VLAN allocation, trunking, loop protection, gateway relationships, and validated failover.

## Stop conditions
Escalate if topology cannot be verified, changes risk isolating management, or required L2 extension crosses uncontrolled domains.