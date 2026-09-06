# Packet Loss and Latency Diagnosis

## Purpose
Systematically isolate network packet loss, jitter, and latency across hosts, links, devices, overlays, providers, and application paths.

## When to use
Use for degraded response time, intermittent timeouts, retransmissions, jitter, or regional performance complaints.

## Inputs
Ping/MTR data, packet captures, interface counters, flow logs, TCP metrics, path traces, application timing, and recent changes.

## Context to inspect
Inspect both directions of the path, queueing points, MTU, retransmissions, congestion, shaping, provider boundaries, and host resource pressure.

## Core knowledge
Latency is cumulative and packet loss can be directional. ICMP behavior does not always represent application traffic; TCP retransmissions and queueing often reveal hidden path problems.

## Procedure
1. Establish baseline and affected scope.
2. Compare healthy and unhealthy source-destination pairs.
3. Trace forward and reverse paths where possible.
4. Correlate hop timing with interface and flow telemetry.
5. Check retransmissions, congestion, queue drops, and MTU symptoms.
6. Validate host and application timing to exclude non-network delay.
7. Narrow the fault domain through controlled tests.
8. Apply the smallest safe remediation.
9. Capture before/after evidence.

## Decision points
Use packet capture when transport symptoms are ambiguous. Use provider escalation when evidence places degradation beyond owned infrastructure.

## Common failure patterns
Treating ICMP rate limiting as packet loss, ignoring reverse paths, blaming network without transport evidence, and testing from nonrepresentative locations.

## Verification
Repeat representative tests, compare latency percentiles and retransmission rates, and confirm user-facing recovery.

## Expected output
An evidence-backed fault-domain diagnosis and remediation result.

## Stop conditions
Escalate when diagnosis requires privileged capture on sensitive systems or provider-side telemetry unavailable to the operator.