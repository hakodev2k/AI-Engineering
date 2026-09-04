# Policy Performance Rules

## Purpose
Keep policy evaluation within required latency, throughput, memory, and availability budgets without weakening correctness or security.

## Scope
Applies to evaluator runtime, policy compilation, bundle loading, decision caching, external data access, and high-volume enforcement paths.

## MUST
- Critical policy paths MUST have measurable latency and throughput objectives derived from the consuming system's requirements.
- Performance changes MUST be supported by before-and-after measurements using representative policy and input distributions.
- Expensive external lookups on synchronous decision paths MUST have explicit timeout, caching, or precomputation strategies.
- Caches MUST include all decision-relevant dimensions needed to prevent incorrect reuse across subjects, resources, tenants, policy versions, or environments.
- Performance optimizations MUST preserve decision semantics and auditability.
- Evaluator saturation and queueing behavior MUST be observable before they become systemic availability failures.

## MUST NOT
- Policy controls MUST NOT be removed or made permissive solely to meet latency targets without approved risk acceptance.
- Benchmark results from trivial policies or unrealistic inputs MUST NOT be presented as production evidence.
- Unbounded policy data, recursion, query fan-out, or result expansion MUST NOT be introduced on critical paths without explicit limits.

## SHOULD
- Policy bundles SHOULD be compiled, indexed, or preloaded where supported and justified by measurements.
- Repeated invariant computation SHOULD be moved out of hot decision paths when correctness is preserved.

## Exceptions
Exceptions require documented workload evidence, affected SLOs, trade-offs, risk, alternative approaches, and approval when security behavior is changed.

## Verification
Use benchmarks, load tests, profilers, runtime metrics, cache-correctness tests, and representative production traces. Confirm improvements under realistic concurrency and verify decision equivalence before and after optimization.