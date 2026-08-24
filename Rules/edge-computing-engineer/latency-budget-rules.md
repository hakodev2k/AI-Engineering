# Latency Budgets
## Purpose
Protect end-to-end response objectives with explicit budgets.
## Scope
Interactive and real-time edge paths.
## MUST
- End-to-end latency objectives MUST be decomposed across network, queueing, compute, storage, and downstream calls.
- Tail latency MUST be measured under representative load.
- Changes affecting critical paths MUST be compared against a baseline.
## MUST NOT
- MUST NOT report average latency as sufficient evidence for tail-sensitive workloads.
- MUST NOT claim an optimization without before/after measurements.
## SHOULD
- Budgets SHOULD reserve headroom for traffic growth and degraded conditions.
## Exceptions
Any budget breach accepted for release requires documented impact, duration, mitigation, and approval.
## Verification
Inspect SLOs, traces, load tests, percentile metrics, and benchmark artifacts.