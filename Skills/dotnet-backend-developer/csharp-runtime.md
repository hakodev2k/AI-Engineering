# C# and .NET Runtime Engineering

## Purpose
Provide a repeatable Senior-level method for choosing C#/.NET runtime techniques that preserve correctness, maintainability, and measured performance.

## When to use
Use for core implementation, runtime-sensitive reviews, allocation/GC investigations, concurrency primitives, and modernization. Do not optimize runtime details without evidence.

## Inputs
Repository, target framework, compiler settings, hot paths, profiles, deployment model.

## Preconditions
Confirm supported .NET/language versions, nullable settings, analyzers, and runtime constraints.

## Context to inspect
Project files, `Directory.Build.props`, warnings, allocation-heavy code, exception patterns, disposal, threading, benchmarks.

## Core knowledge
Value/reference semantics, records, generics, collections, delegates/closures, LINQ costs, spans/memory, async state machines, exceptions, GC/LOH, pooling, JIT/tiering, boxing, disposal, nullable references, thread-safety.

## Procedure
1. Define correctness and performance requirements.
2. Inspect existing conventions and target runtime.
3. Model ownership, mutability, nullability, and lifetime.
4. Choose structures by access pattern and complexity.
5. Keep hot paths simple until profiling proves a bottleneck.
6. Make disposal and cancellation explicit.
7. Review async and concurrency semantics.
8. Add analyzers/tests/benchmarks proportional to risk.
9. Measure again after performance changes.

## Decision points
Prefer classes for identity/lifecycle-heavy objects and structs for small value-like data. Use spans, pooling, or custom synchronization only when evidence justifies complexity.

## Common failure patterns
Premature optimization, shared mutable state, accidental boxing, closure allocations, LOH churn, missing disposal, fire-and-forget tasks, swallowed exceptions, ignored nullable warnings.

## Verification
Build with analyzers, run tests, inspect profiler/benchmark evidence where relevant, and stress concurrency-sensitive paths.

## Expected output
Idiomatic C# with explicit lifecycle and documented trade-offs.

## Stop conditions
Escalate unsafe code, native interop, runtime-version changes, or high-risk concurrency changes requiring specialist review.