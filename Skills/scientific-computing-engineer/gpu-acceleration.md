# GPU Acceleration

## Purpose
Move suitable scientific kernels to GPUs or other accelerators with explicit control over memory movement, occupancy, precision, and correctness.

## When to use
Use when profiling shows compute-intensive, parallel kernels that can amortize accelerator transfer and launch costs.

## Inputs
Profiles, kernel dimensions, data layout, accelerator model, memory limits, precision requirements, and baseline CPU results.

## Context to inspect
Host-device transfers, kernel launch frequency, memory coalescing, divergence, occupancy, library alternatives, and synchronization.

## Core knowledge
GPU performance depends on arithmetic intensity, memory hierarchy, parallelism, occupancy, and transfer cost. Specialized vendor libraries often outperform custom kernels and reduce maintenance risk.

## Procedure
1. Profile end-to-end runtime.
2. Identify high-cost kernels with sufficient parallel work.
3. Estimate arithmetic intensity and transfer overhead.
4. Evaluate optimized accelerator libraries first.
5. Restructure data for efficient access where justified.
6. Minimize transfers and synchronization.
7. Select precision based on validated error requirements.
8. Benchmark kernel and end-to-end performance.
9. Validate results against trusted references.
10. Test multiple representative device classes if supported.

## Decision points
Keep work on CPU when transfer or launch overhead dominates. Use mixed precision only when error analysis demonstrates acceptable results.

## Common failure patterns
Optimizing kernel time while ignoring transfers, excessive synchronization, branch divergence, poor memory access, and device-specific tuning with no portability plan.

## Verification
Measure total speedup, memory use, numerical error, and behavior on supported devices; confirm fallback behavior where required.

## Expected output
An accelerator implementation or recommendation with measured benefit, precision policy, and portability constraints.

## Stop conditions
Stop when acceleration cannot meet correctness requirements or produces insignificant end-to-end improvement.