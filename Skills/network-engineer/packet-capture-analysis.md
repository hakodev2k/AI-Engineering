# Packet Capture Analysis

## Purpose
Use packet-level evidence to diagnose protocol, latency, loss, retransmission, handshake, MTU, and application-network interaction problems.

## When to use
Use when higher-level telemetry is inconclusive, reproducing intermittent failures, validating protocol behavior, or proving where a transaction breaks.

## Inputs
Incident timeline, endpoints, protocol, expected transaction, capture points, topology, timestamps, and relevant logs.

## Preconditions
Obtain authorization because captures may contain sensitive payloads or credentials. Minimize collection scope and retention.

## Context to inspect
Inspect NAT/proxy boundaries, encryption, asymmetric paths, offload effects, MTU, clocks, and whether capture points see both directions.

## Core knowledge
A capture reflects one observation point, not universal truth. TCP retransmissions, resets, window behavior, TLS handshakes, DNS exchanges, and ICMP signals must be interpreted with topology context.

## Procedure
1. Define the exact question the capture should answer.
2. Select the narrowest useful capture points and filters.
3. Synchronize clocks and reproduce the event.
4. Identify the target flow by five-tuple/session context.
5. Reconstruct handshake and request/response sequence.
6. Measure delays between protocol stages.
7. Examine loss, retransmissions, resets, fragmentation, and window behavior.
8. Compare captures from multiple points when location of loss matters.
9. Correlate with device and application logs.
10. Sanitize and dispose of sensitive captures per policy.

## Decision points
Capture near both ends for ambiguous path issues; capture at a boundary when testing NAT/firewall behavior. Decrypt only with explicit authorization and safe key handling.

## Common failure patterns
Capturing too broadly, misreading offload artifacts, blaming retransmission source rather than loss location, ignoring clock skew, and retaining sensitive PCAPs indefinitely.

## Verification
Produce a timestamped packet sequence that supports or disproves the hypothesis and correlates with other telemetry.

## Expected output
Evidence-based diagnosis with relevant packet observations, timing, affected layer, and next remediation step.

## Stop conditions
Stop when authorization is absent, capture would expose prohibited data, or the required observation point risks production stability.