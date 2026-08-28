# Build Performance Rules

## Purpose
Improve build speed using measured evidence without sacrificing correctness or maintainability.

## Scope
Applies to local builds, CI builds, dependency graph evaluation, compilation, linking, caching, remote execution, and artifact transfer.

## MUST
- Build performance changes MUST be supported by before-and-after measurements on representative workloads.
- Optimization work MUST distinguish CPU, I/O, network, scheduler, cache, and dependency-graph bottlenecks.
- Performance improvements MUST preserve clean-build and incremental-build correctness.
- Build-time regressions above team-defined thresholds MUST be investigated with evidence.
- Critical-path analysis MUST consider both individual task duration and graph parallelism.

## MUST NOT
- MUST NOT claim faster builds based on anecdotal developer observations alone.
- MUST NOT remove validation or correctness checks solely to improve benchmark numbers.
- MUST NOT optimize rare paths while materially degrading common developer workflows without documented trade-offs.

## SHOULD
- Performance dashboards SHOULD track median and tail build durations separately.
- Optimization effort SHOULD prioritize frequently executed and critical-path work.

## Exceptions
Exceptions require documented business constraints, benchmark methodology, correctness evidence, and explicit acceptance of trade-offs.

## Verification
Review build profiles, timing traces, cache metrics, CI duration trends, and controlled benchmark results across representative changes.