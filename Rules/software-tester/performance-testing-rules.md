# Performance Testing Rules

## Purpose
Provide measured evidence that critical workloads meet performance expectations.
## Scope
Latency, throughput, concurrency, resource use, scalability, endurance, and degradation.
## MUST
- Define workload, data volume, environment, measurement window, success thresholds, and baseline before conclusions.
- Compare meaningful before/after results under controlled conditions.
- Correlate failures with system metrics, logs, traces, or equivalent evidence.
## MUST NOT
- Claim performance improvement from anecdotal observation.
- Run load against production without explicit authorization and safeguards.
## SHOULD
- Include warm-up, percentile latency, saturation behavior, and realistic traffic shape where relevant.
## Exceptions
Approximate early tests must be labeled non-production-representative.
## Verification
Inspect scripts, workload model, raw measurements, baselines, environment details, and observability evidence.