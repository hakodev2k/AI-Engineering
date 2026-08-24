# Register Allocation

## Purpose
Assign virtual values to physical registers and stack locations while respecting interference, calling conventions, and code-quality goals.

## When to use
Use for new targets, spill regressions, allocator changes, register-class bugs, or performance tuning.

## Inputs
Machine IR, liveness, register classes, ABI/calling convention, target costs, benchmarks.

## Context to inspect
Live intervals, interference, coalescing, spill/reload insertion, reserved registers, subregisters, call clobbers, frame lowering.

## Core knowledge
Allocation is constrained by interference and target register classes. Coalescing can reduce copies but increase pressure. Spill cost depends on execution frequency and rematerialization opportunity.

## Procedure
1. Validate liveness and register constraints.
2. Identify pressure hot spots and register classes.
3. Apply allocator strategy appropriate to compile-time/code-quality goals.
4. Respect fixed, reserved, caller/callee-saved, and subregister constraints.
5. Model spill costs with block frequency when available.
6. Prefer rematerialization where safe and cheaper.
7. Insert spills/reloads and revalidate machine IR.
8. Inspect generated code on pressure-heavy cases.

## Decision points
Graph coloring may improve quality at higher compile cost; linear scan suits latency-sensitive/JIT contexts. Aggressive coalescing is not always profitable under high pressure.

## Common failure patterns
Incorrect liveness, call-clobber mistakes, overlapping subregister assignments, spill storms, allocator nondeterminism, stack-slot lifetime errors.

## Verification
Machine verifier, ABI tests, pressure stress tests, assembly inspection, runtime and compile-time benchmarks.

## Expected output
Correct allocation with controlled spills and documented performance trade-offs.

## Stop conditions
Escalate if target register constraints or ABI ownership are incomplete.