# Bottleneck Analysis Rules
## Purpose
Identify the constraint that actually limits safe throughput.
## Scope
Compute, memory, storage, databases, queues, network, quotas, and dependencies.
## MUST
- Capacity conclusions MUST identify the limiting resource or explicitly state that it is unbounded by available evidence.
- Bottleneck analysis MUST use saturation, queueing, latency, error, and throughput evidence together where applicable.
- After removing a bottleneck, the next likely constraint MUST be reassessed.
## MUST NOT
- MUST NOT infer bottlenecks from utilization percentage alone.
- MUST NOT claim added capacity improves throughput without validation.
## SHOULD
- Analysis SHOULD distinguish hard limits from efficiency problems.
## Exceptions
Proxy metrics require documented justification.
## Verification
Review telemetry correlation, load tests, profiles, query plans, and post-change measurements.