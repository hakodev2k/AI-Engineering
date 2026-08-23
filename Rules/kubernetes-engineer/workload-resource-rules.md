# Workload Resource Rules
## Purpose
Prevent unstable scheduling, noisy-neighbor failures, and waste through explicit resource governance.
## Scope
CPU, memory, ephemeral storage, requests, limits, quotas, and workload sizing.
## MUST
- Set evidence-based resource requests for production workloads and review them against observed utilization.
- Define namespace or tenant quotas where shared capacity can be exhausted.
- Investigate repeated CPU throttling, OOM kills, eviction, or pending pods as capacity or sizing signals.
## MUST NOT
- Copy arbitrary requests and limits between unrelated workloads.
- Claim a sizing improvement without before/after utilization or latency evidence.
## SHOULD
- Use representative load tests and production telemetry to tune resources.
## Exceptions
Temporary sizing overrides require an expiry condition and monitoring.
## Verification
Inspect manifests, quota configuration, scheduler events, utilization metrics, OOM/eviction history, and load-test evidence.