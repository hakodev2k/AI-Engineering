# Performance Rules

## Purpose
Control end-to-end latency, throughput, and resource cost using evidence.
## Scope
Browser rendering, APIs, databases, network, caching, and background work.
## MUST
- Measure relevant baseline and after-change behavior before claiming improvement.
- Investigate bottlenecks across the full request path rather than optimizing one layer by assumption.
- Set performance budgets for user-critical paths where latency materially affects outcomes.
## MUST NOT
- Trade correctness or security for performance without explicit risk approval.
- Optimize solely from microbenchmarks when production behavior is end-to-end.
## SHOULD
- Use profiling, traces, query plans, and real-user/server metrics.
## Exceptions
Emergency mitigations require follow-up measurement and permanent remediation tracking.
## Verification
Compare repeatable benchmarks and production telemetry under representative load.