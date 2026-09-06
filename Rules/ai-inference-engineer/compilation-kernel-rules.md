# Compilation and Kernel Rules

## Purpose
Control correctness and performance risks introduced by graph compilation, kernel fusion, and hardware-specific optimization.

## Scope
Ahead-of-time and just-in-time compilation, graph capture, fused kernels, custom kernels, shape specialization, and compiler caches.

## MUST
- Compiled execution paths MUST be validated against a trusted reference on representative inputs.
- Shape specialization assumptions MUST be explicit and covered by fallback or rejection behavior.
- Compiler and kernel versions MUST be traceable to each production deployment.
- Performance improvements MUST be measured on target hardware under representative load.
- Compilation cache invalidation MUST account for model, runtime, compiler, and hardware compatibility.

## MUST NOT
- MUST NOT accept numerically divergent outputs without defined tolerance and quality evidence.
- MUST NOT route unsupported shapes into optimized kernels that were not validated for them.
- MUST NOT reuse compiled artifacts across incompatible hardware or runtime identities.

## SHOULD
- Maintain correctness tests for optimized versus reference execution.
- Track compilation time, cache hit rate, and fallback frequency.

## Exceptions
Experimental kernels require bounded rollout, correctness evidence, rollback, and approval.

## Verification
Inspect reference comparisons, compiler metadata, cache keys, benchmark results, and fallback tests.