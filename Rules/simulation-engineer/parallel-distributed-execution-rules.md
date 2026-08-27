# Parallel and Distributed Execution Rules
## Purpose
Prevent concurrency and decomposition defects in scaled simulations.
## Scope
Threads, processes, clusters, accelerators, domain decomposition, and distributed runs.
## MUST
- Define ownership and synchronization for shared or exchanged state.
- Test decomposition invariance where mathematically expected.
- Handle worker failure, partial output, and retry semantics explicitly.
## MUST NOT
- Introduce data races or order-dependent reductions without documenting numerical implications.
- merge incomplete distributed outputs as successful results.
## SHOULD
- Prefer deterministic reductions for regression-critical workloads where practical.
## Exceptions
Nondeterministic execution requires statistical equivalence criteria.
## Verification
Use race detection, repeated-run comparisons, fault injection, scaling tests, and output completeness checks.