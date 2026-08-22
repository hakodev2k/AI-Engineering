# Benchmark Design Rules
## Purpose
Produce repeatable evidence for performance decisions.
## Scope
Microbenchmarks, component benchmarks, and comparative experiments.
## MUST
- Control relevant variables and document hardware, runtime, configuration, dataset, warmup, and repetitions.
- Compare changes against a representative baseline using the same method.
- Report distributions or percentiles when variance matters.
## MUST NOT
- Claim improvement from a single uncontrolled run.
- Benchmark debug builds when production uses optimized builds unless explicitly studying debug behavior.
## SHOULD
- Automate stable benchmarks and retain historical results.
## Exceptions
Exploratory tests may be lighter but MUST be labeled non-conclusive.
## Verification
Inspect benchmark configuration, raw results, variance, baseline comparability, and reproducibility.