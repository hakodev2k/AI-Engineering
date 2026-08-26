# Realtime Load and Capacity Testing

## Purpose
Determine safe operating limits and degradation behavior for signaling, TURN, SFU, and media services.

## When to use
Use before launches, architecture changes, major events, scaling-policy changes, or after saturation incidents.

## Inputs
Traffic model, room-size distribution, bitrate/layer profiles, SLOs, infrastructure topology, resource metrics, and load tooling.

## Core knowledge
RTC capacity is multidimensional: sessions, participants, packets/sec, bandwidth, sockets, CPU, memory, retransmission cache, and control-plane rates can become independent ceilings. Realistic distributions matter.

## Procedure
1. Model production traffic and peak multipliers.
2. Define success, quality, and overload thresholds.
3. Baseline a single instance/node under representative media.
4. Increase load gradually while tracking resource and quality tails.
5. Test hot rooms, reconnect bursts, keyframe spikes, and relay-heavy traffic.
6. Exercise autoscaling and admission controls.
7. Test dependency and node failures near expected peak.
8. Identify the first hard and soft bottlenecks.
9. Set operational headroom and scaling thresholds.
10. Repeat after optimization or topology changes.

## Decision points
Scale on the resource or workload signal that predicts quality loss, not generic CPU alone. Reserve headroom for failures and bursts. Admission control is preferable to uncontrolled collapse.

## Common failure patterns
Uniform synthetic rooms; ignoring packet rate; testing only steady state; no failure injection; scaling after saturation; capacity numbers without software/hardware version context.

## Verification
Verify sustained SLO compliance below the declared safe limit and controlled degradation above it, including failover scenarios.

## Expected output
A versioned capacity envelope, bottleneck evidence, scaling policy, and headroom recommendation.

## Stop conditions
Stop when load testing risks shared production systems or realistic traffic cannot be generated safely.