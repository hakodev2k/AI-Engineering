# Performance and Capacity Rules

## Purpose
Keep schema lookup, registration, and compatibility evaluation within measurable latency and throughput objectives.

## Scope
Registry API latency, storage growth, cache behavior, compatibility checks, subject count, request volume, and saturation.

## MUST
- Production performance objectives MUST define representative workloads and percentile latency targets.
- Capacity plans MUST account for growth in subjects, versions, schema references, clients, and request rate.
- Performance changes MUST be supported by before-and-after measurements.
- Compatibility checks and schema parsing MUST be profiled when they materially affect registration latency.
- Saturation indicators for registry, storage, network, and authentication dependencies MUST be monitored.

## MUST NOT
- MUST NOT claim performance improvement from synthetic microbenchmarks alone when end-to-end evidence is available.
- MUST NOT add unbounded caches or client retry storms to hide registry latency.
- MUST NOT remove required validation solely to improve throughput.

## SHOULD
- Benchmark cold and warm lookup paths separately.
- Test burst registration and large-schema scenarios where realistic.

## Exceptions
Accepted performance regressions require documented benefit, affected SLO, mitigation, and approval.

## Verification
Review load tests, latency distributions, profiles, saturation dashboards, and capacity forecasts.