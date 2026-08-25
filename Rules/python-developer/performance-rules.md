# Performance Rules
## Purpose
Make optimization evidence-driven and production-relevant.
## Scope
CPU, memory, I/O, serialization, startup, and hot paths.
## MUST
- Performance changes MUST define the metric and workload being improved.
- Claimed improvements MUST have comparable before/after measurements.
- Memory growth and algorithmic complexity MUST be considered for scale-sensitive paths.
## MUST NOT
- MUST NOT optimize based only on intuition when measurement is practical.
- MUST NOT trade correctness or security for speed without explicit approval.
## SHOULD
- Profile representative workloads before changing architecture.
## Exceptions
Obvious pathological complexity may be fixed first, then verified.
## Verification
Benchmarks, profiles, load tests, memory measurements, and production telemetry.