# Performance Testing Rules

## Purpose
Make automated performance conclusions measurable, reproducible, and tied to user or system risk.

## Scope
Applies to load, latency, throughput, endurance, resource, and frontend performance tests.

## MUST
- Performance tests MUST define workload, environment, dataset, metric, percentile or aggregation, and acceptance threshold before claiming pass/fail.
- Comparisons MUST use comparable conditions and preserve baseline evidence.
- Warm-up, caching, concurrency, and rate controls MUST be explicit when they affect results.
- Regressions MUST be investigated with system telemetry rather than test timing alone.

## MUST NOT
- MUST NOT claim improvement from a single uncontrolled run.
- MUST NOT compare materially different environments without qualification.
- MUST NOT generate unsafe load against production without explicit human approval and safeguards.

## SHOULD
- Prefer representative workload distributions and percentile latency.
- Track trends for critical performance budgets.

## Exceptions
Exploratory measurements may relax strict thresholds but MUST be labeled non-conclusive.

## Verification
Review test configuration, baselines, raw metrics, telemetry, repeatability, and statistical variation.