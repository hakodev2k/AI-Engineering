# Memory and Resource Management

## Purpose
Control RAM, flash, stack, heap, buffers, and peripheral resources predictably under constrained embedded environments.

## When to use
Use during design, memory pressure, fragmentation concerns, stack faults, buffer sizing, or feature growth.

## Inputs
Map file, memory budget, allocation sites, stack measurements, buffer requirements, workload bounds, and target constraints.

## Context to inspect
Inspect static/global data, task stacks, heap configuration, dynamic allocation, recursion, large locals, protocol buffers, DMA buffers, and retained memory.

## Core knowledge
Embedded memory failures are often workload-dependent. Static allocation improves predictability but may waste capacity; dynamic allocation improves flexibility but introduces fragmentation, failure paths, and lifecycle complexity. Stack must be measured, not guessed.

## Procedure
1. Establish flash/RAM budgets and reserved margins.
2. Categorize static, stack, heap, DMA, and retained memory.
3. Find large and unbounded allocations.
4. Define maximum concurrent buffer demand.
5. Measure stack high-water marks under worst workloads.
6. Remove accidental copies and oversized lifetimes.
7. Define allocation-failure behavior if heap is used.
8. Track memory growth in CI/build reports.

## Decision points
Prefer static/pool allocation for hard real-time and bounded critical paths. Use heap only with understood allocator behavior, bounded lifecycle, and explicit failure handling.

## Common failure patterns
Assuming average stack use, hidden library allocations, variable-size buffers without caps, heap use in ISRs, silent allocation failure, and optimizing bytes before measuring major consumers.

## Verification
Inspect map output, execute worst-case scenarios, measure stack/heap peaks, test allocation exhaustion where applicable, and verify safety margin.

## Expected output
A quantified memory budget with ownership, bounds, failure behavior, and monitoring of regressions.

## Stop conditions
Stop when maximum workload or memory regions reserved by boot/security/hardware are unknown.