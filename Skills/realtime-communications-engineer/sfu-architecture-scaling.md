# SFU Architecture and Scaling

## Purpose
Design and scale selective forwarding units for low-latency multiparty media.

## When to use
Use for conference architecture, participant growth, regional scaling, fan-out cost, or SFU saturation.

## Inputs
Room-size distribution, stream/layer counts, bitrate profiles, CPU/network metrics, routing model, regional traffic, and SLOs.

## Core knowledge
SFUs forward rather than mix media, so network I/O, packet processing, subscriptions, retransmission caches, encryption boundaries, and room placement dominate design. Failure domains and room affinity matter as much as aggregate throughput.

## Procedure
1. Model per-room ingress and egress by media/layer.
2. Identify CPU, memory, NIC, socket, and packet-rate ceilings.
3. Define room placement and affinity.
4. Bound participant and subscription fan-out.
5. Design layer selection and receiver constraints.
6. Plan regional routing and TURN interaction.
7. Define overload admission and graceful degradation.
8. Establish drain, restart, and failover procedures.
9. Load-test realistic room distributions, not only uniform synthetic traffic.
10. Validate telemetry and capacity headroom.

## Decision points
Keep a room on one SFU when simplicity and latency dominate; cascade/federate only when scale or geography requires it. Scale out before hard resource ceilings, but avoid fragmentation that wastes capacity.

## Common failure patterns
Sizing by bandwidth alone; ignoring packet rate; unbounded subscriptions; hot rooms; no drain semantics; failover that requires full-room reconnect; insufficient headroom for retransmission spikes.

## Verification
Validate capacity under realistic room mixes, overload behavior, failover, latency, packet loss, and resource headroom.

## Expected output
A scalable SFU topology, capacity model, overload policy, and measured limits.

## Stop conditions
Escalate when architecture requires cross-region data-policy approval or production capacity changes beyond authorized limits.