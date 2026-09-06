# Graph Compilation Rules

## Purpose
Use graph capture, compilation, fusion, and specialization without introducing brittle or incorrect execution paths.

## Scope
Compiled graphs, captured graphs, operator fusion, shape specialization, recompilation, and fallback behavior.

## MUST
- Compiled execution MUST be validated against an unoptimized reference for supported inputs.
- Shape, dtype, device, and control-flow guards MUST match the assumptions used for specialization.
- Recompilation frequency and cache growth MUST be measured under representative workloads.
- Fallback behavior MUST be explicit when compilation or capture is unsupported.

## MUST NOT
- MUST NOT assume dynamic workloads will remain within traced shapes without guards.
- MUST NOT suppress correctness checks to keep a graph compilable.
- MUST NOT accept excessive recompilation as normal without investigating its cause.

## SHOULD
- SHOULD prefer stable specialization boundaries that capture material performance gains.
- SHOULD measure compile cost separately from steady-state execution.

## Exceptions
Exceptions require documented workload constraints, fallback behavior, and evidence.

## Verification
Run reference comparisons, guard tests, dynamic-shape tests, compile-cache inspection, and cold/steady-state benchmarks.