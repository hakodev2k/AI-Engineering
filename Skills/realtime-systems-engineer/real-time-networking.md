# Real-Time Networking

## Purpose
Design network communication with explicit latency, jitter, ordering, loss, and recovery semantics suitable for deadline-sensitive systems.

## When to use
Use for distributed control, telemetry with deadlines, industrial Ethernet, TSN, CAN, DDS, UDP/TCP real-time paths, or network-induced jitter.

## Inputs
Message rates, sizes, deadlines, topology, protocol, QoS capabilities, loss tolerance, synchronization requirements.

## Context to inspect
NIC queues, switch configuration, traffic classes, kernel/network stack, buffering, retransmission, congestion control, serialization, and timestamping.

## Core knowledge
Network determinism depends on topology, contention, queueing, protocol semantics, and clock synchronization. Reliable retransmission improves delivery probability but can violate deadlines; late data may be worse than dropped data.

## Procedure
1. Classify message criticality and deadline.
2. Define acceptable loss, duplication, reordering, and staleness.
3. Budget serialization, propagation, switching, queueing, and software latency.
4. Select transport/protocol from deadline and reliability needs.
5. Configure QoS, traffic shaping, and priority where supported.
6. Bound queues and define drop policy.
7. Include synchronization error when timestamps matter.
8. Test congestion, burst traffic, packet loss, link flap, and failover.
9. Measure end-to-end latency and jitter at relevant percentiles and maxima.

## Decision points
Prefer deadline-aware datagrams when late retransmissions have no value; choose reliable transport when correctness requires eventual delivery and deadlines allow recovery.

## Common failure patterns
Unbounded socket buffers, head-of-line blocking, retry storms, treating LAN latency as constant, missing stale-data checks, and ignoring switch/NIC queue configuration.

## Verification
Use packet captures, hardware/software timestamps, congestion tests, and fault injection to validate deadline and loss semantics.

## Expected output
A network timing contract, protocol/QoS design, queue bounds, and measured behavior.

## Stop conditions
Stop when shared network infrastructure cannot provide or demonstrate the required timing isolation.