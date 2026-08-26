# Performance and Capacity

## Purpose
Keep gateway latency, throughput, and resource consumption within measurable service objectives.

## Scope
CPU, memory, connections, bandwidth, serialization, buffering, and policy overhead.

## MUST
- Performance claims MUST use before/after measurements under representative workload.
- Capacity limits MUST include headroom for expected bursts and failure scenarios.
- Added gateway policy MUST be evaluated for latency and resource cost on critical paths.
- Saturation signals MUST be observable before hard exhaustion.

## MUST NOT
- MUST NOT optimize based only on intuition when measurable evidence is available.
- MUST NOT use unbounded request or response buffering.
- MUST NOT hide saturation by increasing limits without understanding the bottleneck.

## SHOULD
- Tests SHOULD report latency distributions, not averages alone.
- Capacity models SHOULD include connection concurrency and downstream latency effects.

## Exceptions
Exceptions require evidence explaining why representative measurement is impractical and an alternative verification method.

## Verification
Benchmark representative workloads, inspect p50/p95/p99 latency, throughput, saturation, memory, CPU, connections, and compare results to defined objectives.