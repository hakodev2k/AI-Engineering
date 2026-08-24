# Queueing and Concurrency Rules
## Purpose
Control latency and backlog risks caused by finite service capacity.
## Scope
Queues, worker pools, connection pools, concurrency gates, and asynchronous pipelines.
## MUST
- Plans MUST distinguish arrival rate, service rate, concurrency, and backlog growth.
- Queue capacity MUST include drain-time analysis after credible bursts or outages.
- Worker scaling MUST be checked against downstream concurrency limits.
## MUST NOT
- MUST NOT treat queue depth alone as sufficient capacity evidence.
- MUST NOT increase concurrency without measuring contention and dependency impact.
## SHOULD
- Queueing models SHOULD use percentile service times where tails materially affect capacity.
## Exceptions
Simplified models require evidence that queueing effects are negligible.
## Verification
Review arrival/service metrics, backlog simulations, drain tests, and saturation telemetry.