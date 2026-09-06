# MTU, Fragmentation, and Path MTU

## Purpose
Diagnose and prevent MTU mismatches, fragmentation failures, and black-hole Path MTU Discovery across physical, virtual, VPN, and overlay networks.

## When to use
Use when small requests work but large payloads fail, TLS handshakes stall, tunnels introduce unexplained loss, or encapsulation changes paths.

## Inputs
Interface MTUs, tunnel overhead, packet captures, ICMP behavior, MSS settings, path topology, and failing payload sizes.

## Context to inspect
Inspect every encapsulation boundary, effective inner-packet MTU, firewall handling of ICMP, TCP MSS clamping, and IPv4/IPv6 differences.

## Core knowledge
Encapsulation reduces usable MTU. Blocking required ICMP can break PMTUD and create silent black holes. Fragmentation may hide design flaws and add CPU overhead.

## Procedure
1. Reproduce failure with controlled packet sizes and DF behavior.
2. Determine smallest failing payload.
3. Map effective MTU across each hop and tunnel.
4. Inspect ICMP Packet Too Big/Fragmentation Needed handling.
5. Check MSS negotiation for TCP traffic.
6. Identify encapsulation overhead and mismatch.
7. Prefer correcting path MTU over broad fragmentation workarounds.
8. Apply targeted MSS clamping only when appropriate.
9. Document expected effective MTU.

## Decision points
Standardize MTU end to end where possible. Use jumbo frames only when every path segment supports them consistently.

## Common failure patterns
Blocking ICMP, inconsistent jumbo frames, forgotten tunnel overhead, assuming host MTU equals path MTU, and masking problems with indiscriminate fragmentation.

## Verification
Test representative protocols and payload sizes through all critical paths and confirm absence of retransmission or fragmentation anomalies.

## Expected output
A verified effective-MTU model and corrective configuration.

## Stop conditions
Escalate when changing MTU affects shared infrastructure or third-party network paths outside operational control.