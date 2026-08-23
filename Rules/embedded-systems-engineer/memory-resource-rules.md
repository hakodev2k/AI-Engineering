# Memory and Resource Rules

## Purpose
Prevent memory exhaustion, fragmentation, leaks, and resource starvation on constrained targets.

## Scope
RAM, flash, stacks, heaps, DMA buffers, descriptors, handles, and peripheral resources.

## MUST
- Establish memory budgets for critical components and verify linker/map output against them.
- Size stacks with measured high-water evidence plus safety margin.
- Define ownership and lifetime for buffers and scarce resources.

## MUST NOT
- Introduce unbounded allocation into long-running or timing-critical firmware.
- Ignore linker warnings, stack overflow indicators, or resource exhaustion paths.

## SHOULD
- Prefer static or bounded allocation when deterministic resource use is required.

## Exceptions
Dynamic allocation requires bounded behavior, failure handling, measurement, and review.

## Verification
Inspect map files, stack high-water marks, heap/resource telemetry, stress tests, and static analysis.