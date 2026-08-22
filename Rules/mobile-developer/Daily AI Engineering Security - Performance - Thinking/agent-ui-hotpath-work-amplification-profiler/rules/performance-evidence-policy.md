# Performance Evidence Rules

- A hot-path optimization **MUST** have a baseline from a representative workload.
- Before/after comparisons **MUST** replay equivalent workloads and metric definitions.
- Clone/copy reduction **MUST NOT** violate ownership, lifetime, thread-safety, or mutation isolation requirements.
- Notification suppression **MUST** be based on semantic change criteria and **MUST NOT** drop required edge/event semantics.
- Performance claims **MUST** cite measured metrics, not code appearance.
- Regression budgets **MUST** include at least one latency metric and one amplification metric.
- Telemetry **MUST NOT** require storing sensitive conversation/tool payload contents when sizes/counts suffice.
- Failed optimization attempts **MUST** retain evidence and **MUST NOT** relax correctness tests.
- Optimization loops **MUST** be bounded to two attempts before re-diagnosis/escalation.
- A verifier independent from the implementer **MUST** confirm workload equivalence and correctness.
- Teams **SHOULD** track clone bytes, redundant wakeups, allocation rate/RSS, and p95 latency over long-session workloads.