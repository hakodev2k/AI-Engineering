# Pipeline Performance Rules

## Purpose
Improve delivery speed without weakening correctness or safety.

## Scope
Queue time, build duration, caching, parallelism, test partitioning, and runner utilization.

## MUST
- Performance changes MUST preserve required validation and security controls.
- Claimed improvements MUST use before/after measurements from comparable workloads.
- Caches MUST have keys and trust boundaries that prevent unsafe cross-revision or cross-trust contamination.
- Bottleneck work MUST prioritize measured critical-path delay rather than intuition.
- Resource limits MUST prevent individual jobs from destabilizing shared runner capacity.

## MUST NOT
- MUST NOT skip required tests to meet a duration target.
- MUST NOT share writable caches between trusted and untrusted workloads without isolation.
- MUST NOT claim speedup from a single anomalous run.

## SHOULD
- Use safe parallelism, incremental builds, and deterministic caching where evidence supports them.
- Track p50 and tail duration, not averages alone.

## Exceptions
Document constraint, measurement, risk, and compensating controls.

## Verification
Compare pipeline telemetry, cache hit/miss behavior, critical path, runner saturation, and repeated benchmark runs before and after changes.