# Kernel Correctness Rules

## Purpose
Prevent silent numerical corruption, races, out-of-bounds access, and undefined GPU kernel behavior.

## Scope
Applies to custom kernels, generated kernels, shader/compute code, and kernel launch configuration.

## MUST
- Kernel outputs MUST be validated against a trusted reference for representative and boundary inputs.
- Indexing and launch dimensions MUST be proven safe for partial blocks and non-aligned sizes.
- Shared/global memory ordering MUST use synchronization with semantics sufficient for the dependency.
- Numerical tolerances MUST be explicit and appropriate to the datatype and algorithm.
- Error status from launches and synchronization points MUST be checked where failures can surface.

## MUST NOT
- MUST NOT rely on race timing, implicit cross-block ordering, or uninitialized device memory.
- MUST NOT suppress sanitizer or correctness failures to pass CI.
- MUST NOT use approximate arithmetic where error bounds violate application requirements.

## SHOULD
- Include adversarial sizes, degenerate shapes, and randomized differential tests.

## Exceptions
Any relaxed numerical requirement requires documented error bounds, consumer acceptance criteria, and validation evidence.

## Verification
Run reference comparisons, race/memory sanitizers, boundary tests, deterministic checks where applicable, and code review of synchronization and indexing.