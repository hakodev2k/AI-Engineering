# Memory Planning and Buffer Reuse

## Purpose
Minimize peak memory and allocation overhead by planning tensor lifetimes, buffer reuse, workspace, and aliasing safely across LLM execution.

## When to use
Use when models exceed device memory, allocation overhead is high, KV-cache pressure grows, or compiler-generated intermediates dominate memory.

## Inputs
- IR with liveness information
- Tensor shapes and dtypes
- Alias/effect metadata
- Runtime allocator behavior
- Target memory limits

## Preconditions
Establish a trustworthy alias model and distinguish persistent state, parameters, KV cache, outputs, temporaries, and backend workspaces.

## Context to inspect
Inspect liveness, in-place operations, views, asynchronous execution, stream dependencies, dynamic shapes, workspace APIs, memory pools, and fragmentation metrics.

## Core knowledge
Peak memory depends on overlapping live ranges rather than total tensor bytes. Safe reuse requires non-overlapping lifetimes and compatible size/alignment/device requirements. Views and asynchronous kernels complicate apparent liveness. Aggressive in-place reuse can block parallelism or violate autograd/training semantics if the pipeline supports them.

## Procedure
1. Classify all allocations by lifetime and mutability.
2. Compute conservative live ranges.
3. Model aliases, views, asynchronous consumers, and stream completion.
4. Identify reusable buffers with compatible requirements.
5. Account for alignment and backend workspace constraints.
6. Add bounded strategies for dynamic shapes.
7. Separate persistent pools from temporary arenas.
8. Generate a memory plan and runtime assertions.
9. Measure peak allocated/reserved memory and fragmentation.
10. Stress test maximum supported shapes and concurrent requests.

## Decision points
Use static planning when shapes and schedules are predictable. Use pooled dynamic allocation when workloads vary substantially. Prefer reuse that does not lengthen critical-path dependencies or prevent overlap.

## Common failure patterns
- Reusing a buffer before asynchronous consumers finish.
- Ignoring hidden backend workspace.
- Treating views as independent storage.
- Optimizing allocated bytes while reserved memory remains high.
- Assuming one request when runtime batches or overlaps requests.

## Verification
Implemented means runtime follows the generated plan. Verified means memory safety tests pass, peak memory decreases under representative workloads, concurrency remains correct, and no hidden synchronization or latency regression appears.

## Expected output
A validated memory plan, allocator strategy, safety guards, and before/after memory evidence.

## Stop conditions
Stop when aliasing cannot be established, asynchronous lifetimes are unknown, or required maximum-shape memory exceeds hardware capacity even after safe optimization.