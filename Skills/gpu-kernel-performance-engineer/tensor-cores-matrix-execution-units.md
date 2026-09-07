# Tensor Cores and Matrix Execution Units

## Purpose
Map suitable dense or structured matrix operations onto specialized matrix execution units while controlling layout, tile shape, precision, accumulation, and fallback behavior.

## When to use
Use for GEMM-like kernels, convolutions lowered to matrix operations, attention subproblems, or other workloads where tensor/matrix units can materially outperform scalar/vector ALUs.

## Inputs
Operation dimensions, data types, layouts, alignment, target GPU capabilities, numerical tolerances, profiler instruction mix, compiler/runtime support.

## Preconditions
Confirm that the target architecture supports the intended matrix instruction mode and that correctness criteria permit its precision and accumulation behavior.

## Context to inspect
Inspect supported tile shapes, operand layouts, alignment constraints, fragment/register pressure, accumulation type, sparsity modes, padding cost, epilogue operations, and fallback paths for unsupported shapes.

## Core knowledge
Specialized matrix units achieve high throughput only when data shapes, layouts, and instruction modes align with hardware. Peak throughput can be lost through poor feeding, excessive conversions, small shapes, register pressure, or epilogue bottlenecks.

## Procedure
1. Identify matrix-like portions of the computation.
2. Confirm supported operand and accumulator types.
3. Choose candidate tile shapes compatible with target hardware.
4. Arrange memory layout and alignment for efficient operand loading.
5. Stage or transform data only when reuse amortizes the cost.
6. Fuse lightweight epilogues when doing so reduces traffic without excessive registers.
7. Measure matrix-unit utilization and surrounding memory stalls.
8. Compare against optimized non-matrix-unit baselines for small or irregular shapes.
9. Validate numerical error over realistic input distributions.
10. Provide a portable fallback when required by the supported device matrix.

## Decision points
Use specialized units when shape and precision compatibility yield end-to-end benefit. Prefer padding only when added work is cheaper than fragmented execution. Keep fallback paths for tiny, irregular, or unsupported cases.

## Common failure patterns
Assuming matrix-unit use guarantees speedup; ignoring data conversion cost; choosing oversized tiles that cause spills; validating only nominal shapes; fusing so much epilogue logic that compute-unit utilization drops.

## Verification
Confirm the intended matrix instructions are emitted, runtime improves end-to-end, memory feeding is sufficient, numerical tolerances pass, and fallback behavior is correct.

## Expected output
A measured matrix-unit implementation strategy with supported shapes, precision contract, and fallback policy.

## Stop conditions
Escalate when precision requirements exclude supported modes, shapes are structurally incompatible, or vendor-specific acceleration conflicts with portability requirements.