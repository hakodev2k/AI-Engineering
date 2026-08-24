# Register Allocation Rules

## Purpose
Allocate machine resources without corrupting program state.

## Scope
Liveness, interference, spilling, coalescing, physical registers, and register classes.

## MUST
- Allocation MUST respect live-range interference and target register constraints.
- Spills and reloads MUST preserve value width, type-relevant bits, and ordering requirements.
- Reserved and special-purpose registers MUST be modeled explicitly.
- Allocation failures MUST degrade safely or diagnose unsupported pressure scenarios.

## MUST NOT
- MUST NOT assign overlapping live values to the same physical resource unless proven compatible.
- MUST NOT clobber callee-saved or special registers contrary to ABI rules.
- MUST NOT trade correctness for reduced spill count.

## SHOULD
- Heuristics SHOULD be benchmarked on representative workloads.
- Debug modes SHOULD verify allocation invariants.

## Exceptions
Target-specific register sharing requires explicit legality conditions and tests.

## Verification
Use machine-IR verification, stress tests with high register pressure, ABI tests, randomized allocation tests, and execution comparison.