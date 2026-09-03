# Serving Architecture Rules

## Purpose
Protect clear boundaries and predictable behavior in model-serving systems.

## Scope
Applies to inference gateways, model workers, schedulers, preprocessors, postprocessors, and supporting services.

## MUST
- Separate request admission, model execution, and result transformation responsibilities where operational ownership differs.
- Document critical dependencies and failure propagation paths.
- Keep model-specific execution concerns isolated from generic transport concerns.
- Define resource ownership for CPU, GPU, memory, queues, and network paths.

## MUST NOT
- Couple unrelated model deployments through hidden shared state.
- Introduce synchronous dependency chains without explicit latency and failure budgets.
- Bypass established service boundaries merely to reduce implementation effort.

## SHOULD
- Prefer independently scalable components when workload characteristics differ materially.
- Keep architecture reversible when evaluating new serving runtimes.

## Exceptions
Exceptions require trade-off analysis, expected operational impact, rollback strategy, and architecture review.

## Verification
Review architecture diagrams, dependency graphs, deployment topology, failure-mode tests, and resource-allocation configuration.