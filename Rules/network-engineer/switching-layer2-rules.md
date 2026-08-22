# Switching and Layer 2 Rules

## Purpose
Prevent loops, uncontrolled broadcast domains, and fragile Layer 2 dependencies.

## Scope
VLANs, trunks, spanning tree, link aggregation, switching boundaries, and access ports.

## MUST
- Define VLAN purpose, ownership, allowed trunks, and Layer 3 boundary.
- Protect loop-prevention mechanisms and validate topology changes against root/path expectations.
- Restrict trunk VLANs to those actually required.
- Configure access ports according to endpoint role and security requirements.

## MUST NOT
- Extend Layer 2 domains without documented operational need and failure-domain analysis.
- Disable loop protection to bypass a topology problem.

## SHOULD
- Minimize broadcast-domain size and unnecessary Layer 2 adjacency.

## Exceptions
Legacy constraints require documented risk, monitoring, migration intent, and approval.

## Verification
Inspect VLAN/trunk configuration, spanning-tree state, MAC behavior, link aggregation, topology maps, and failover tests.