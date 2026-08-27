# Switching, VLANs, and Spanning Tree

## Purpose
Engineer Layer-2 domains that are predictable, loop-safe, and appropriately bounded.

## When to use
Use for access/distribution switching, VLAN changes, trunk failures, loops, MAC instability, or STP redesign.

## Inputs
Physical topology, VLAN inventory, trunks, STP mode/state, MAC tables, port channels, endpoint requirements, and incident logs.

## Context to inspect
Root bridges, allowed/native VLANs, port roles, BPDU protections, LACP state, MAC movement, storm control, and L3 gateway placement.

## Core knowledge
Layer 2 has broad failure propagation. Keep broadcast domains small and prefer routing at stable boundaries. STP is a safety mechanism, not a substitute for intentional topology. LACP and MLAG-like systems have platform-specific failure semantics.

## Procedure
1. Map physical and logical topology.
2. Identify VLAN purpose, gateway, and required attachment points.
3. Verify root placement and expected blocked/forwarding paths.
4. Audit trunk allowed lists and native VLAN consistency.
5. Validate edge protections such as BPDU guard and loop guard where appropriate.
6. Inspect MAC learning and movement.
7. Verify port-channel member consistency and LACP state.
8. Check broadcast/multicast/unknown-unicast rates.
9. Design the smallest necessary L2 footprint.
10. Apply changes from the edge inward with rollback access.
11. Validate topology after each material change.

## Decision points
Route instead of trunk when cross-domain L2 adjacency is not required. Use port channels for capacity/redundancy only when hashing and peer architecture support the traffic profile. Stretch VLANs only for demonstrated application constraints.

## Common failure patterns
Accidental loops, wrong STP root, VLAN pruning mistakes, native VLAN mismatch, orphaned MLAG ports, MAC flapping, single-flow port-channel saturation, and excessive L2 stretch.

## Verification
Confirm STP topology, VLAN reachability, MAC stability, port-channel state, gateway access, loop protections, and representative failover.

## Expected output
Validated L2 topology, VLAN/trunk changes, protection controls, failure analysis, and verification evidence.

## Stop conditions
Stop on uncontrolled loop symptoms, management-path risk, unknown cross-connects, or platform-specific multi-chassis behavior that cannot be verified.