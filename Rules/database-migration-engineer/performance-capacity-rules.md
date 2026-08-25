# Performance and Capacity

## Purpose
Prevent migrations from exhausting production capacity or violating service objectives.

## Scope
Covers CPU, memory, I/O, network, storage, logs, locks, connection pools, and replication capacity.

## MUST
- Resource headroom MUST be measured before high-volume migration work begins.
- Throughput targets MUST be derived from measured capacity and completion windows, not guesswork.
- Migration rate MUST be throttled or paused when defined service-health thresholds are exceeded.

## MUST NOT
- MUST NOT claim a performance optimization without before-and-after measurements.
- MUST NOT consume all available capacity merely to minimize migration duration.

## SHOULD
- Benchmark representative workloads and account for peak business traffic.
- Reserve storage headroom for indexes, logs, snapshots, temporary structures, and rollback artifacts.

## Exceptions
Emergency recovery may temporarily prioritize migration throughput when incident authority accepts the service risk.

## Verification
Inspect baseline metrics, load tests, capacity calculations, query plans, throttling behavior, and live service objectives.