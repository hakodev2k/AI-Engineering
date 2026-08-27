# Performance and Scale

## Purpose
Keep configuration systems responsive and safe as fleet size, configuration volume, and change frequency grow.

## Scope
Storage, rendering, distribution, polling, streaming, caching, and client activation paths.

## MUST
- Performance requirements MUST be defined for critical configuration delivery and activation paths.
- Scale-sensitive changes MUST be supported by measurement or load evidence before broad rollout.
- Distribution mechanisms MUST prevent synchronized polling or retry patterns from overloading control planes.
- Large configuration payloads MUST be assessed for network, parsing, memory, and activation cost.
- Capacity limits and throttling behavior MUST be known for critical dependencies.

## MUST NOT
- Performance improvement MUST NOT be claimed without before/after evidence.
- Configuration freshness MUST NOT be increased by aggressive polling without evaluating control-plane capacity.
- Unbounded history, payload growth, or fan-out MUST NOT be accepted without retention or scaling strategy.

## SHOULD
- Cache immutable revisions and distribute deltas when complexity is justified by measurement.
- Monitor propagation latency at relevant percentiles.

## Exceptions
Temporary capacity overprovisioning may be used during migrations with documented cost, duration, and rollback criteria.

## Verification
Use benchmarks, load tests, payload profiles, capacity dashboards, and propagation metrics. Compare expected peak fan-out and retry behavior against measured control-plane limits.