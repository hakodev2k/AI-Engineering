# Network Path Rules

## Purpose
Ensure storage reliability accounts for network behavior between clients, replicas, and control planes.

## Scope
Applies to storage traffic paths, multipathing, MTU, congestion, packet loss, latency, and network partitions.

## MUST
- Map critical storage network paths and redundant dependencies.
- Test multipath failover and partition behavior under realistic load.
- Correlate storage latency with network telemetry during investigation.

## MUST NOT
- Attribute storage latency to devices before excluding network bottlenecks.
- Configure redundant paths that share an undocumented single failure point.
- Change MTU, routing, or path policy in production without validation and rollback.

## SHOULD
- Separate control and data traffic where justified by scale or failure isolation.
- Monitor retransmits, drops, path asymmetry, and saturation.

## Exceptions
Temporary single-path operation requires elevated monitoring, explicit risk ownership, and restoration criteria.

## Verification
Review topology, path health, failover tests, packet and interface metrics, and incident traces.