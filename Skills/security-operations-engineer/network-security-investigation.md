# Network Security Investigation

## Purpose
Use network evidence to validate command-and-control, lateral movement, exfiltration and service abuse while accounting for NAT, proxies and encryption.

## When to use
Use for suspicious destinations, unusual flows, IDS alerts, beaconing or unexpected east-west traffic.

## Inputs
Flow records, DNS, proxy, firewall, IDS/NDR, DHCP, VPN, asset inventory and endpoint/application telemetry.

## Context to inspect
Understand address translation, proxy chains, DNS resolvers, segmentation, cloud networking, load balancers and retention gaps.

## Core knowledge
An IP address is rarely an identity. Network observations need temporal mapping to hosts/users. Encryption limits payload visibility but metadata remains valuable.

## Procedure
1. Normalize timestamps and identify observation points.
2. Resolve source/destination to assets and identities at event time.
3. Build connection and DNS timeline.
4. Compare volume, cadence, ports and destinations with baseline.
5. Correlate endpoint/process or application context.
6. Inspect lateral paths and segmentation boundaries.
7. Search for peer systems contacting the same infrastructure.
8. Estimate transferred data and likely protocol behavior.
9. Apply containment at the narrowest effective control point.
10. Validate blocks and monitor alternate paths.

## Decision points
Block domains, IPs, identities or workloads based on stability and collateral impact. Prefer behavior-based detections for shared/cloud infrastructure.

## Common failure patterns
Attributing NAT IP to one host; ignoring DNS; blocking shared CDN addresses; confusing backups with exfiltration; no endpoint correlation.

## Verification
Reproduce entity attribution, corroborate suspicious behavior, confirm containment and test for recurrence or alternate destinations.

## Expected output
Network investigation timeline with attribution, scope, confidence and control actions.

## Stop conditions
Escalate when packet capture, provider records or cross-boundary approvals are required.