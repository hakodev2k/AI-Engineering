# Performance and Capacity
## Purpose
Ensure identity services meet latency and throughput needs without weakening controls.
## Scope
Authentication, token issuance, policy evaluation, directory queries, and provisioning.
## MUST
- Performance changes MUST be supported by representative before/after measurements.
- Capacity plans MUST consider peak authentication, login storms, token refresh, and bulk lifecycle events.
- Caching MUST define freshness and revocation consequences.
## MUST NOT
- Security validation MUST NOT be removed merely to improve latency.
- Performance claims MUST NOT be based solely on synthetic microbenchmarks when end-to-end behavior matters.
## SHOULD
- Establish service-level indicators for critical identity paths.
## Exceptions
Document constraint, evidence, residual risk, and monitoring.
## Verification
Load tests, latency distributions, saturation metrics, cache tests, and production telemetry.