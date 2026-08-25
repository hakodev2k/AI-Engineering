# Performance and Capacity Rules

## Purpose
Keep gRPC systems within latency, throughput, CPU, memory, and connection budgets.

## Scope
Serialization, message size, concurrency, connections, streams, compression, and benchmarking.

## MUST
- Performance claims MUST use before/after measurements under representative conditions.
- Capacity tests MUST include realistic message sizes, concurrency, streaming mix, and dependency behavior.
- Maximum message sizes and concurrency limits MUST be intentional.
- Optimization MUST identify the measured bottleneck before broad complexity is introduced.

## MUST NOT
- MUST NOT enable compression universally without measuring CPU/network trade-offs.
- MUST NOT increase limits to hide saturation without capacity analysis.
- MUST NOT benchmark only happy-path localhost latency when making production claims.

## SHOULD
- Track p50, p95, p99 or appropriate tail latency alongside throughput and resource utilization.
- Reuse channels/connections according to runtime guidance rather than creating one per request.

## Exceptions
Temporary limit increases require evidence, monitoring, rollback criteria, and ownership.

## Verification
Use reproducible load tests, profilers, resource metrics, payload distributions, and production telemetry comparisons.