# Congestion Control and Bandwidth Estimation

## Purpose
Keep interactive media stable and fair as available network capacity changes.

## When to use
Use for bitrate oscillation, freezes, queueing delay, poor adaptation, or capacity-policy work.

## Inputs
Transport feedback, sender bitrate, packet loss, RTT, jitter, pacing, queue delay, layer-selection events, and network traces.

## Core knowledge
Realtime congestion control must balance utilization against latency and loss. Bandwidth estimates are uncertain and feedback-delayed. Pacing, probing, transport feedback, encoder adaptation, receiver constraints, and SFU layer selection form one control loop.

## Procedure
1. Establish baseline quality and transport metrics.
2. Correlate feedback arrival with bitrate and layer changes.
3. Identify loss-based, delay-based, receiver, or application constraints.
4. Inspect pacing and probing behavior.
5. Reproduce with controlled bandwidth, RTT, jitter, and loss transitions.
6. Check hysteresis and minimum dwell times for adaptation.
7. Tune one control dimension at a time.
8. Validate fairness with competing traffic and multiple participants.
9. Compare user-visible freezes and latency against baseline.

## Decision points
Reduce bitrate before sacrificing conversational continuity. Prefer stable adaptation over chasing short-lived bandwidth spikes. Layer switching may be cheaper than continuous encoder reconfiguration in SFU systems.

## Common failure patterns
Reacting to every loss event; feedback loops fighting each other; ignoring queueing delay; aggressive probing on constrained links; no hysteresis; measuring throughput without latency.

## Verification
Run repeatable impairment profiles and verify bounded latency, stable bitrate, acceptable loss, fair sharing, and improved freeze/quality metrics.

## Expected output
An evidence-backed congestion diagnosis or adaptation policy with before/after measurements.

## Stop conditions
Stop when required transport feedback is unavailable or a network middlebox prevents meaningful controlled validation.