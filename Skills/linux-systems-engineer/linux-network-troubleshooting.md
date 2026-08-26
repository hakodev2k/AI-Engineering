# Linux Network Troubleshooting

## Purpose
Systematically isolate connectivity, latency, loss, routing, DNS, socket, firewall, and kernel-networking faults.

## When to use
Use for connection failures, intermittent timeouts, packet loss, retransmissions, DNS delays, or host-specific network degradation.

## Inputs
Source/destination, protocol/ports, timestamps, topology, network namespace, logs, packet and socket metrics.

## Context to inspect
Inspect interfaces, addresses, routes, policy routing, namespaces, DNS, MTU, firewall, conntrack, proxies, load balancers, and cloud networking.

## Core knowledge
Use layered reasoning across name resolution, routing, ARP/ND, TCP/UDP, MTU, congestion, socket queues, NAT, stateful filtering, and application protocols.

## Procedure
1. Define exact failing flow.
2. Verify DNS independently from transport.
3. Inspect interface/link/address state.
4. Validate routes and policy rules in the correct namespace.
5. Test reachability and port behavior from both ends when possible.
6. Inspect sockets, retransmits, drops, queues, conntrack, and firewall counters.
7. Capture packets narrowly when metrics cannot distinguish hypotheses.
8. Correlate with upstream devices/services.
9. Apply minimal correction and retest the original flow.

## Decision points
Packet capture is warranted when endpoint state is insufficient. Change MTU only with path evidence. Disable firewall rules only in controlled tests, never as a default fix.

## Common failure patterns
Testing from the wrong namespace, assuming ping proves application reachability, ignoring asymmetric routing, broad packet captures, and blaming DNS for transport failures.

## Verification
Verify DNS timing, connection establishment, loss/retransmits, latency, socket errors, and application success under representative traffic.

## Expected output
Failure layer, evidence, remediation, and validated network path.

## Stop conditions
Stop if capture may expose sensitive payloads, network ownership lies outside available authority, or changes risk broad connectivity loss.