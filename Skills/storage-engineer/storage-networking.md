# Storage Networking

## Purpose
Engineer reliable, low-latency network paths for storage protocols and diagnose transport bottlenecks without masking underlying congestion.

## When to use
Use for iSCSI/NVMe-oF/NFS/SMB/object traffic, multipath design, packet-loss incidents, or throughput limitations.

## Inputs
Protocol, topology, bandwidth, latency, MTU, loss/retransmits, flow counts, redundancy requirements, and host/storage NIC capabilities.

## Preconditions
Coordinate with network ownership and preserve management/recovery access during changes.

## Context to inspect
NICs, bonding, VLANs, routing, switches, QoS, MTU, flow control, congestion control, multipathing, DNS, firewalls, and storage ports.

## Core knowledge
Storage traffic is sensitive to loss, congestion, oversubscription, head-of-line blocking, and path asymmetry. Jumbo frames help only when end-to-end consistent. Redundant links require verified failover, not just duplicate cabling.

## Procedure
1. Map end-to-end data paths and failure domains.
2. Baseline bandwidth, latency, loss, retransmits, and utilization.
3. Validate MTU and protocol settings end to end.
4. Verify path redundancy and multipath policy.
5. Identify oversubscription and contention.
6. Apply QoS/congestion controls only with evidence.
7. Test failover and recovery.
8. Load-test representative flows.
9. Correlate transport metrics with storage latency.

## Decision points
Separate storage networks when isolation and predictability justify cost; converge when shared fabric has sufficient controls and headroom. Avoid lossless assumptions unless the full fabric is engineered accordingly.

## Common failure patterns
Partial jumbo frames, asymmetric routes, single hidden failure domains, bufferbloat, oversubscribed uplinks, and tuning host queues to hide network loss.

## Verification
Packet/transport counters, failover tests, throughput/latency tests, and path tracing demonstrate expected behavior under normal and failed paths.

## Expected output
A documented storage-network topology, configuration policy, bottleneck analysis, and validated redundancy.

## Stop conditions
Stop when network changes exceed authority, risk management-plane loss, or packet evidence is unavailable for a destructive hypothesis.
