# Packet Capture Analysis

## Purpose
Use packet-level evidence to diagnose realtime transport failures without guessing from application symptoms.

## When to use
Use for unexplained loss, jitter, retransmission, MTU, connectivity, timing, or protocol interoperability problems when capture is authorized.

## Inputs
PCAPs, synchronized logs, session identifiers, SDP, RTC stats, network topology, and incident timeline.

## Preconditions
Obtain authorization and define handling/retention for potentially sensitive network data.

## Core knowledge
Useful analysis correlates packet timestamps, five-tuples, STUN/TURN, DTLS, RTP/RTCP metadata, sequence numbers, SSRCs, feedback, retransmissions, and network-layer behavior. Encryption limits payload inspection but not much transport diagnosis.

## Procedure
1. Confirm capture points and clock accuracy.
2. Filter to the affected session and flows.
3. Build a timeline from connectivity through media.
4. Identify candidate path, DTLS establishment, and RTP start.
5. Analyze sequence gaps, reordering, bursts, RTT, and feedback.
6. Compare both ends when captures exist.
7. Distinguish capture loss from network loss.
8. Correlate findings with RTC stats and infrastructure events.
9. Form and test a bounded root-cause hypothesis.
10. Sanitize retained evidence.

## Decision points
Capture closer to the suspected fault boundary. Prefer metadata-first analysis; decrypt only when explicitly authorized and necessary. Use active impairment tests when production captures cannot isolate causality.

## Common failure patterns
Unsynchronized clocks; wrong interface; capture drops mistaken for packet loss; inspecting one direction only; ignoring NAT/relay rewriting; retaining sensitive captures indefinitely.

## Verification
A conclusion is verified only when packet evidence, application telemetry, and reproduction or corrective test agree.

## Expected output
A timestamped packet-level finding with supporting evidence, uncertainty, and remediation validation.

## Stop conditions
Stop if capture authorization is absent, sensitive-data policy would be violated, or evidence cannot identify the relevant flow.