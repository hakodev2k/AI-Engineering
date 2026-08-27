# QoS and Traffic Engineering

## Purpose
Protect latency-sensitive and business-critical traffic during contention using measurable classification, marking, queuing, and shaping policy.

## When to use
Use for voice/video quality, congested WANs, provider QoS integration, traffic prioritization, or queue-drop incidents.

## Inputs
Application classes, DSCP markings, bandwidth, traffic baselines, provider policy, interface queues, latency/jitter/loss targets, and packet captures.

## Context to inspect
Where classification occurs, trust boundaries, remarking, queue mapping, shaping/policing, drops, ECN where used, and bandwidth at every bottleneck.

## Core knowledge
QoS matters primarily at contention points. It cannot create bandwidth. Classification should happen near trusted sources, and end-to-end marking consistency matters more than complex queue counts.

## Procedure
1. Identify real bottlenecks and peak utilization.
2. Define a small set of application classes with business owners.
3. Determine trustworthy classification signals.
4. Establish DSCP marking and trust/remark boundaries.
5. Map classes to queues and scheduling behavior.
6. Reserve priority bandwidth conservatively for truly latency-sensitive traffic.
7. Shape to downstream/provider rates when necessary.
8. Avoid policing TCP unless the trade-off is understood.
9. Validate provider treatment and remarking.
10. Generate representative contention and measure per-class delay/drop.
11. Monitor queue depth, drops, and utilization after deployment.

## Decision points
Use shaping to smooth traffic when downstream rate is known; policing enforces hard limits but can amplify retransmissions. Use strict priority only with bounded admission to prevent starvation.

## Common failure patterns
QoS configured where no congestion exists, trusting arbitrary endpoint markings, oversized priority queues, mismatched provider classes, hidden lower-speed links, and judging success from configuration rather than queue telemetry.

## Verification
Under controlled contention, confirm classification, markings, queue placement, shaping rate, per-class loss/latency, and protection of target applications.

## Expected output
QoS policy, class definitions, bandwidth assumptions, provider mapping, test evidence, and monitoring thresholds.

## Stop conditions
Escalate when application ownership is unclear, provider treatment cannot be confirmed, or available bandwidth is fundamentally insufficient for required traffic.