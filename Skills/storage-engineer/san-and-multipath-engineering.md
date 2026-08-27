# SAN and Multipath Engineering

## Purpose
Design and troubleshoot resilient block-storage connectivity across hosts, fabrics, targets, and multipath layers.

## When to use
Use for Fibre Channel or iSCSI deployments, path failures, latency issues, zoning changes, host onboarding, and storage migrations.

## Inputs
Host initiators, target ports, LUN mappings, zoning, VLAN/network data, multipath configuration, path states, and vendor interoperability guidance.

## Context to inspect
HBAs/NICs, switches, fabrics, target controllers, ALUA/path policy, queue settings, authentication, and host logs.

## Core knowledge
End-to-end redundancy requires independent paths across initiator, fabric/network, target, and controller failure domains. Multipath policy must match array behavior. A visible path is not necessarily an active optimized path.

## Procedure
1. Draw every host-to-LUN path and failure domain.
2. Validate initiator and target identities.
3. Review zoning/masking or network isolation.
4. Confirm path discovery and expected count.
5. Validate multipath policy and optimized/non-optimized states.
6. Check link errors, queueing, retransmissions, and fabric congestion.
7. Fail one path/fabric at a time under controlled load.
8. Measure failover and recovery behavior.
9. Confirm stale devices are safely removed during migrations.
10. Update diagrams and runbooks.

## Decision points
Use redundant isolated fabrics where availability warrants it; select active-active or active-passive policy according to array capabilities. Prefer minimal zoning/masking scope for security and blast-radius control.

## Common failure patterns
Both paths on one switch, duplicate IDs, incorrect LUN masking, path flapping, unsupported multipath defaults, and removing devices while I/O remains active.

## Verification
Confirm expected paths, clean error counters, successful failover, no I/O corruption, and stable latency during controlled path loss.

## Expected output
Validated topology, configuration changes, failover evidence, and operational runbook.

## Stop conditions
Escalate before zoning/masking changes with ambiguous ownership or when path manipulation could disconnect the only production path.