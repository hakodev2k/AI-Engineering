# ICE, STUN, and TURN Connectivity

## Purpose
Engineer reliable media connectivity across NATs, firewalls, mobile networks, VPNs, and restrictive enterprise environments.

## When to use
Use for call setup failures, TURN planning, ICE policy changes, regional relay design, or connectivity SLO work.

## Inputs
ICE candidate logs, RTC stats, TURN configuration, network traces, geographic traffic, firewall requirements, and setup-success metrics.

## Core knowledge
ICE gathers host, server-reflexive, and relay candidates and checks candidate pairs. TURN is a reliability mechanism, not merely an exceptional fallback. UDP is generally preferred for media, while TCP/TLS relay paths may be essential on restrictive networks. Candidate priority, trickle timing, DNS, credentials, relay capacity, and geographic distance affect setup and quality.

## Procedure
1. Segment failures by platform, network, region, and candidate type.
2. Inspect candidate gathering and connectivity-check timelines.
3. Confirm STUN/TURN DNS, reachability, credentials, expiry, and transport support.
4. Validate UDP relay and required TCP/TLS fallback paths.
5. Check ICE restart behavior after network changes.
6. Measure relay selection, setup latency, and failed-pair reasons.
7. Capacity-plan TURN bandwidth, ports, egress, and regional redundancy.
8. Test symmetric NAT, UDP-blocked, VPN, mobile handoff, and high-loss scenarios.
9. Add alerts on relay health and connectivity regressions.

## Decision points
Do not force relay unless privacy, policy, topology, or predictability requires it. Add relay regions when latency or concentration risk justifies operational cost. Prefer evidence from candidate-pair statistics over assumptions about NAT type.

## Common failure patterns
Expired TURN credentials; missing TLS relay; firewall port mismatch; unhealthy DNS; insufficient relay bandwidth; treating `connected` as proof of usable media; ICE restart omitted after interface changes.

## Verification
Verify successful candidate nomination across the supported network matrix, relay failover, bounded setup time, stable media after network transitions, and capacity under load.

## Expected output
A diagnosed connectivity path or validated ICE/TURN design with measurable setup-success evidence.

## Stop conditions
Escalate when external firewall policy, carrier behavior, credential infrastructure, or production relay changes require another owner.