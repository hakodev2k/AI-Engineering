# Latency Rules
## Purpose
Control response-time behavior and tail latency.
## Scope
Interactive requests, APIs, jobs, queues, and distributed calls.
## MUST
- Measure relevant percentiles, not only averages.
- Decompose end-to-end latency across application, network, queueing, storage, and dependencies.
- Define timeout budgets consistent with the end-to-end objective.
## MUST NOT
- Hide tail regressions behind aggregate averages.
- Add retries without accounting for their latency and load amplification.
## SHOULD
- Track latency by operation and meaningful workload dimension.
## Exceptions
Low-volume paths may use alternate statistics when percentile estimates are unstable.
## Verification
Inspect traces, histograms, timeout settings, dependency timings, and regression comparisons.