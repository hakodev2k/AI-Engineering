# Query Performance

## Purpose
Control tail latency, throughput, resource consumption, and retrieval quality under realistic load.

## Scope
Applies to query execution, ANN parameters, filters, reranking, batching, concurrency, and client behavior.

## MUST
- Performance targets MUST include percentile latency and throughput under defined concurrency and dataset size.
- Optimizations MUST be supported by before/after measurements using representative workloads.
- Tail latency MUST be measured; averages alone are insufficient for production acceptance.
- Query timeouts, concurrency bounds, and resource limits MUST prevent unbounded work.
- Performance testing MUST preserve required relevance constraints rather than trading quality away silently.

## MUST NOT
- MUST NOT claim performance improvement from theoretical complexity or local timing alone.
- MUST NOT remove correctness, tenancy, or security filters solely to improve latency.
- MUST NOT benchmark only warm-cache conditions if cold or mixed-cache behavior is operationally relevant.

## SHOULD
- Profiles SHOULD separate embedding, network, ANN, filtering, reranking, and serialization costs.
- Load tests SHOULD include skewed and expensive query patterns.
- Capacity planning SHOULD use observed saturation curves.

## Exceptions
Exceptions require documented SLO impact, evidence, risk, alternatives, and approval when production objectives are knowingly violated.

## Verification
Review load-test reports, percentile dashboards, profiles, traces, relevance results, timeout tests, saturation measurements, and production telemetry.