# JIT and Runtime Integration

## Purpose
Integrate compilation with a managed or dynamic runtime, including JIT tiers, metadata, deoptimization, GC, exceptions, and runtime helpers.

## When to use
Use for JIT compilers, managed runtimes, dynamic languages, tiering changes, safepoint bugs, or runtime/compiler boundary failures.

## Inputs
Runtime contract, IR, GC model, metadata, calling conventions, profiling/tiering data, failing workload.

## Context to inspect
Runtime helpers, safepoints, stack maps, object layout, barriers, deoptimization metadata, OSR, exception model, code cache.

## Core knowledge
JIT code is constrained by runtime state. GC visibility, safepoints, write barriers, speculative assumptions, deoptimization, and code lifetime are correctness boundaries.

## Procedure
1. Enumerate runtime-visible compiler obligations.
2. Define object/value representation and helper ABIs.
3. Mark safepoints and generate precise stack maps.
4. Emit required allocation/write barriers.
5. Record speculative assumptions and invalidation hooks.
6. Generate deoptimization/OSR metadata when supported.
7. Manage executable-code publication and lifetime safely.
8. Test under GC stress, exceptions, tier transitions, and concurrency.

## Decision points
Use speculation only when deoptimization/invalidation is reliable. Tier aggressively for startup only when warmup and steady-state goals justify recompilation cost.

## Common failure patterns
Missing GC roots, stale speculative code, incorrect barriers, unsafe code publication, mismatched helper ABI, deopt metadata drift.

## Verification
GC stress, runtime conformance, tiering tests, deopt/OSR tests, race testing, and performance benchmarks.

## Expected output
A compiler/runtime integration change with explicit invariants and stress evidence.

## Stop conditions
Stop when runtime ownership, GC contract, or executable-memory security policy is unresolved.