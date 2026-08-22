# Network Security Rules

## Purpose
Limit unintended network exposure and enforce deliberate connectivity.

## Scope
VNets, subnets, NSGs, private endpoints, firewalls, ingress, egress, DNS, peering, and hybrid connectivity.

## MUST
- Define required traffic flows before opening network paths.
- Restrict inbound and outbound access to documented sources, destinations, ports, and protocols.
- Use private connectivity for sensitive services when requirements justify it.
- Review DNS behavior whenever private endpoints or hybrid networks are introduced.
- Preserve diagnostic visibility for denied and security-relevant traffic.

## MUST NOT
- Use unrestricted internet ingress as a permanent troubleshooting shortcut.
- Create overlapping address spaces for networks expected to interconnect.
- Assume a private endpoint alone removes every public-access path.

## SHOULD
- Centralize shared inspection and egress controls where operationally appropriate.
- Automate validation of network rules and route changes.

## Exceptions
Public exposure requires business need, threat assessment, protective controls, monitoring, and approval.

## Verification
Review topology, NSGs, routes, firewall policy, public network settings, DNS resolution tests, flow logs, and connectivity tests.