# Packet Capture Analysis

## Purpose
Use packet-level evidence to diagnose network-security failures, validate protocol behavior, and distinguish network from application problems.

## When to use
Use for unexplained connection failures, TLS issues, suspected attacks, latency, retransmissions, or policy validation.

## Inputs
Incident timeline, endpoints, expected protocol behavior, capture files or approved capture access.

## Context to inspect
Capture location, interface direction, NAT, load balancing, timestamps, packet loss, encryption, asymmetric paths.

## Core knowledge
TCP state, retransmission, windowing, DNS, TLS handshakes, ICMP, fragmentation, sequence analysis, capture bias.

## Procedure
1. Form a testable hypothesis.
2. Choose capture points that can confirm or reject it.
3. Limit capture scope to necessary traffic.
4. Correlate flows by time and endpoint.
5. Reconstruct handshake and transaction sequence.
6. Identify resets, loss, retransmission, delay, or protocol errors.
7. Compare multiple capture points when path ambiguity exists.
8. Preserve evidence securely.

## Decision points
Capture on both sides of a control when determining drops. Prefer metadata when payload collection is unnecessary or sensitive.

## Common failure patterns
Capturing at the wrong point, assuming absence means drop, ignoring offload artifacts, mishandling sensitive payloads, analyzing without a hypothesis.

## Verification
Reproduce the behavior or correlate packet evidence with device/application logs and confirm the inferred failure mechanism.

## Expected output
Evidence-backed timeline, root-cause hypothesis, affected layer, remediation and verification steps.

## Stop conditions
Stop payload capture if authorization or privacy basis is missing, or evidence handling requirements cannot be met.