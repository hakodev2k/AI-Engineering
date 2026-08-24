# Performance and Capacity

## Purpose
Keep API latency and throughput within evidence-based operating limits.

## Scope
Latency budgets, throughput, payload size, connection use, serialization, and capacity planning.

## MUST
- Performance claims MUST use reproducible before/after measurements.
- Critical routes MUST have latency and throughput objectives under representative load.
- Capacity plans MUST include expected growth, burst behavior, and dependency ceilings.
- Large payload or fan-out changes MUST be evaluated for network and downstream cost.

## MUST NOT
- MUST NOT optimize solely from intuition or microbenchmarks disconnected from production behavior.
- MUST NOT remove safety controls merely to improve benchmark numbers.

## SHOULD
- Load tests SHOULD model realistic concurrency and failure modes.

## Exceptions
Unmeasured emergency mitigations require explicit temporary status and follow-up measurement.

## Verification
Review benchmarks, load tests, production percentiles, saturation metrics, and capacity assumptions.