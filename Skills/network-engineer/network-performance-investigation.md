# Network Performance Investigation

## Purpose
Diagnose latency, loss, jitter, throughput, and connection-quality problems using evidence across the complete path.

## When to use
Use for slow applications, throughput complaints, voice/video impairment, retransmissions, congestion, or unexplained regional/site degradation.

## Inputs
User symptoms, timestamps, topology, flow telemetry, interface counters, QoS statistics, synthetic tests, packet captures, host metrics, and application latency.

## Context to inspect
Utilization, errors/discards, queue drops, RTT, retransmissions, MTU, DNS/TLS timings, load balancers, WAN paths, Wi-Fi RF, server capacity, and historical baseline.

## Core knowledge
Throughput is constrained by the slowest relevant resource and protocol behavior. Separate propagation latency, queueing, loss, application processing, and endpoint limitations. Averages hide microbursts and tail latency.

## Procedure
1. Define symptom in measurable terms and affected population.
2. Establish a known-good comparison and historical baseline.
3. Map the full application path.
4. Measure latency/loss hop-wise without assuming traceroute identifies forwarding exactly.
5. Inspect interfaces for utilization, errors, discards, and queue drops.
6. Compare TCP RTT/retransmissions/window behavior where relevant.
7. Validate MTU/PMTUD.
8. Examine QoS and provider telemetry.
9. Separate DNS, connection, TLS, and application response time.
10. Run controlled throughput tests only where safe.
11. Correlate time-series metrics across network and endpoints.
12. Change one causal variable at a time and remeasure.

## Decision points
Add capacity when sustained demand is causal; tune QoS for contention-sensitive classes; fix loss/errors before protocol tuning. Do not increase buffers blindly because bufferbloat can worsen latency.

## Common failure patterns
Relying on ping alone, confusing ICMP de-prioritization with data loss, averaging away spikes, testing outside busy periods, ignoring host limits, and premature bandwidth upgrades.

## Verification
Demonstrate improved target metrics under comparable load and no regression in other classes/paths.

## Expected output
Evidence-based bottleneck analysis, root cause, before/after metrics, remediation, and capacity/monitoring actions.

## Stop conditions
Stop when representative measurements cannot be obtained, testing could disrupt production, or provider/internal ownership requires coordinated escalation.