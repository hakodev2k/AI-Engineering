# Network Storage Rules

## Purpose
Prevent network design from becoming an invisible storage bottleneck or failure amplifier.

## Scope
SAN, NAS, object access, multipathing, fabrics, MTU, routing, DNS, load balancing, and congestion.

## MUST
- Storage network dependencies and redundancy MUST align with storage availability targets.
- Multipath or redundant-path configurations MUST be validated by path-failure testing where supported.
- Throughput and latency budgets MUST include network behavior under contention and failure.
- Network changes affecting critical storage paths MUST include rollback and validation plans.

## MUST NOT
- MUST NOT assume link redundancy provides path redundancy when components share a switch, route, power, or control plane.
- MUST NOT change MTU, routing, zoning, or fabric policy in production without impact analysis and authorization.

## SHOULD
- Monitor retransmits, errors, congestion, path state, and end-to-end latency rather than storage metrics alone.

## Exceptions
Single-path configurations require explicit risk acceptance and recovery planning.

## Verification
Review topology, path state, network telemetry, failover tests, configuration diffs, and change records.