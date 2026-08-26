# Performance Budget Rules
## Purpose
Prevent regressions in startup, navigation, interaction, rendering, memory, and energy use.
## Scope
Browser-engine performance changes and architectural trade-offs.
## MUST
- Performance claims MUST include reproducible before/after measurements on representative workloads.
- Regressions on critical metrics MUST be quantified and explicitly accepted before landing.
- Benchmarks MUST separate noise from statistically meaningful changes.
## MUST NOT
- MUST NOT optimize synthetic benchmarks by violating web semantics or shifting cost invisibly to another critical metric.
- MUST NOT claim improvement from anecdotal traces alone.
## SHOULD
- SHOULD track tail latency and memory peaks in addition to averages.
## Exceptions
Accepted regressions require documented user benefit, alternatives, magnitude, and owner approval.
## Verification
Use controlled benchmarks, traces, profiling, memory measurements, regression dashboards, and reproducibility checks.