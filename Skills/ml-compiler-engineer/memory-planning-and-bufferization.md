# Memory Planning and Bufferization

## Purpose
Transform tensor/value semantics into efficient buffer lifetimes and allocations while preserving aliasing, mutation, and execution correctness.

## When to use
Use when lowering to explicit memory, reducing peak memory, eliminating allocations, or debugging aliasing and lifetime bugs.

## Inputs
SSA/IR graph, tensor shapes, liveness information, aliasing rules, device memory constraints, runtime allocation model.

## Context to inspect
Inspect bufferization interfaces, in-place legality, views, subviews, mutation, escape behavior, allocation scopes, async execution, and device-specific memory spaces.

## Core knowledge
Memory planning is a global lifetime problem. In-place reuse can reduce memory but is legal only when aliases and future reads are respected. Static plans improve predictability; dynamic allocators provide flexibility for symbolic shapes.

## Procedure
1. Compute value lifetimes and alias sets.
2. Identify values eligible for in-place reuse.
3. Preserve mutation and view semantics explicitly.
4. Select stack/static, arena, pooled, or runtime allocation by lifetime and shape knowledge.
5. Reuse buffers only when lifetimes do not conflict.
6. Account for async operations and synchronization before reuse.
7. Track memory spaces and transfer requirements.
8. Estimate peak memory before and after planning.
9. Insert deallocations or ownership transfer at valid points.
10. Test dynamic shapes and exceptional control flow.
11. Profile allocations and peak residency.

## Decision points
Prefer static planning for bounded predictable graphs; prefer dynamic allocation when shape/runtime behavior cannot be known safely. Choose in-place updates only when alias analysis proves legality.

## Common failure patterns
Use-after-free, premature reuse across async work, hidden aliases, excessive temporary buffers, fragmentation, and memory plans specialized to one shape.

## Verification
Run correctness and sanitizer-style memory tests where available, inspect allocation traces, validate alias-sensitive models, and measure peak device/host memory.

## Expected output
A safe bufferization/memory plan with explicit ownership, reuse decisions, peak-memory evidence, and regression coverage.

## Stop conditions
Stop if aliasing cannot be proven, async lifetime boundaries are unclear, or required allocations can exceed target memory without an approved fallback.