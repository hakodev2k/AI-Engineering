# Network Forensics

## Purpose
Reconstruct communications, lateral movement, command-and-control, scanning, and data transfer from packet and flow evidence.

## When to use
Use when network behavior is central to compromise scope, external infrastructure, exfiltration, or host-to-host movement.

## Inputs
PCAP, flow records, DNS/proxy/firewall logs, asset inventory, time window, and indicators.

## Context to inspect
Sensor placement, NAT, TLS visibility, retention, clock synchronization, DHCP/VPN mappings, segmentation, and known service patterns.

## Core knowledge
Absence of observed traffic is not proof of absence. Network telemetry reflects sensor coverage and protocol visibility; encrypted traffic still exposes timing, endpoints, certificate, DNS, and flow characteristics.

## Procedure
1. Validate capture scope, timestamps, and sensor vantage point.
2. Resolve IP-to-asset/user mappings for the relevant period.
3. Baseline expected services and communication patterns.
4. Identify anomalous DNS, connections, ports, beaconing, transfers, and lateral paths.
5. Reconstruct protocol sessions when legally and technically possible.
6. Correlate external infrastructure with host/process evidence.
7. Quantify transfer volume and direction without assuming content.
8. Build a communication timeline and scope related systems.

## Decision points
Use packet detail for protocol/content questions and flow data for broad scope. Treat heuristic beaconing as a lead until corroborated.

## Common failure patterns
Ignoring NAT/VPN changes, overstating encrypted traffic interpretation, using current DNS ownership for historical attribution, and failing to account for sensor gaps.

## Verification
Cross-check critical connections with endpoint, DNS, proxy, firewall, or identity telemetry.

## Expected output
Network timeline, communication graph, suspected infrastructure, and confidence-qualified findings.

## Stop conditions
Stop when collection lacks required authorization, sensor coverage cannot support the requested claim, or decryption would exceed approved scope.