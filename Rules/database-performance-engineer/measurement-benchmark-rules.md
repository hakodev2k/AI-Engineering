# Measurement and Benchmark Rules
## Purpose
Make performance claims falsifiable and repeatable.
## Scope
Benchmarks, tuning experiments, regressions, and optimization proposals.
## MUST
- Define baseline, target metric, test conditions, dataset, warm-up, repetitions, and acceptance threshold before comparing changes.
- Report distributions or percentiles for latency-sensitive work, not only averages.
- Preserve before/after evidence for material optimization claims.
## MUST NOT
- Claim improvement from incomparable environments or materially different workloads.
- Discard unfavorable runs without a documented technical reason.
## SHOULD
- Automate repeatable benchmarks and control environmental noise.
## Exceptions
Exploratory measurements may be less rigorous but MUST be labeled exploratory and MUST NOT support production claims.
## Verification
Inspect benchmark definitions, raw results, environment metadata, statistical summaries, and reproducibility instructions.