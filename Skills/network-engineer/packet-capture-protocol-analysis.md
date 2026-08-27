# Packet Capture and Protocol Analysis

## Purpose
Use packet evidence to isolate network and application-path failures precisely.

## When to use
Use for intermittent connectivity, retransmissions, resets, TLS failures, latency, DNS issues, MTU problems, or disputed network/application ownership.

## Inputs
Affected endpoints, timestamps, five-tuples, topology, expected protocol behavior, captures from relevant points, and synchronized clocks.

## Context to inspect
Capture location, direction, offload effects, NAT, load balancers, tunnels, retransmissions, TCP flags/options, RTT, fragmentation, ICMP, DNS, and TLS handshake metadata.

## Core knowledge
A capture shows what crossed one observation point, not global truth. Compare multiple points when middleboxes transform traffic. TCP sequence/acknowledgment behavior can distinguish loss, delay, receiver limits, resets, and application silence.

## Procedure
1. Define a narrow hypothesis and affected flow.
2. Synchronize timestamps and identify capture points.
3. Apply capture filters to minimize irrelevant/sensitive data.
4. Capture both directions and enough pre-failure context.
5. Identify handshake and connection establishment.
6. Measure RTT and locate retransmissions, duplicate ACKs, resets, zero windows, or stalls.
7. Inspect DNS/TLS/HTTP metadata only as required.
8. Check packet sizes, DF behavior, fragmentation, and ICMP.
9. Compare captures across hops to locate loss/transformation.
10. Correlate with interface, firewall, server, and application telemetry.
11. Redact and securely handle captured payloads.

## Decision points
Capture headers only when payload is unnecessary or sensitive. Use device SPAN/TAP, host capture, or cloud mirroring based on where visibility is needed and capture fidelity.

## Common failure patterns
Capturing on the wrong side of NAT, mistaking checksum offload artifacts for corruption, ignoring asymmetric paths, huge unfocused captures, unsynchronized clocks, and claiming causality from a single retransmission.

## Verification
Reproduce the symptom and show packet-level evidence consistent with the root cause; confirm remediation changes the expected sequence/latency/loss behavior.

## Expected output
Concise packet timeline, evidence-backed fault domain, relevant metrics, and remediation verification.

## Stop conditions
Stop if capture would expose prohibited sensitive data, required vantage points need unauthorized production access, or evidence is insufficient to assign cause.