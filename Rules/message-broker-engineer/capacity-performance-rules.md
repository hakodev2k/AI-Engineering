# Capacity and Performance

## Purpose
Maintain predictable throughput and latency under realistic load.

## Scope
Broker nodes, partitions, queues, producers, consumers, storage, CPU, memory, and network.

## MUST
- Capacity decisions MUST use measured throughput, payload size, latency, replication, retention, and growth assumptions.
- Performance claims MUST include before/after evidence under representative load.
- Headroom MUST account for failure scenarios and maintenance.

## MUST NOT
- MUST NOT size production solely from average traffic.
- MUST NOT increase concurrency without checking downstream and ordering constraints.

## SHOULD
- Track saturation trends and forecast capacity before hard limits.

## Exceptions
Document evidence, risk window, mitigations, and approval.

## Verification
Use load tests, broker metrics, resource saturation, latency percentiles, and capacity models.