# Performance and Cost Rules
## Purpose
Keep analytical workloads and models efficient enough for their operating context.
## Scope
Queries, training, batch scoring, online inference, storage, and compute.
## MUST
- Measure runtime, resource use, and cost for workloads where scale or latency matters.
- Optimize demonstrated bottlenecks using before/after evidence.
- Bound high-cost exploratory jobs before running them on shared or production-scale resources.
## MUST NOT
- Claim performance improvement without comparable measurements.
- Run unbounded scans or training jobs against critical infrastructure without impact assessment.
## SHOULD
- Prefer algorithmic, query, sampling, and data-layout improvements before simply adding compute.
## Exceptions
Urgent diagnostic work requires owner awareness and safeguards.
## Verification
Inspect query plans, profiler output, benchmarks, resource metrics, cost reports, and workload limits.