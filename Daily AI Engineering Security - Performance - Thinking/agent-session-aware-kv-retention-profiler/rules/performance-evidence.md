# Performance Evidence Rules

- A cache-retention optimization **MUST** begin with a workload baseline.
- The baseline **MUST** include TTFT and cache-hit/reused-prefix evidence; throughput and cache occupancy **SHOULD** be included when available.
- Agent lifecycle events **MUST** be correlated by session and turn before claiming a lifecycle-related cache miss.
- A proposal **MUST NOT** claim performance improvement from published third-party benchmarks alone.
- Candidate retention **MUST** be bounded by TTL, capacity, explicit release, or equivalent resource control.
- Completed/dead branches **SHOULD** be released rather than protected indefinitely.
- The optimization **MUST NOT** change prompt content, model output semantics, security isolation or tenant cache boundaries merely to improve hit rate.
- Before/after comparisons **MUST** use comparable workloads and report sample counts.
- A regression in p95 TTFT greater than the configured threshold **MUST** block rollout unless explicitly accepted by the owner.
- Measurement failure **MUST NOT** be interpreted as improvement.
