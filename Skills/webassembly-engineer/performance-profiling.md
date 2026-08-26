# WebAssembly Performance Profiling

## Purpose
Find and prove the real causes of Wasm latency, throughput, CPU, and memory regressions.

## When to use
Use when performance objectives are missed or an optimization/build/runtime change causes regression. Do not optimize solely from code inspection.

## Inputs
Representative workload, SLOs, runtime/browser version, artifact, build flags, profiles, host metrics, and baseline measurements.

## Context to inspect
Inspect compile/instantiate time, execution profiles, host-call frequency, allocations, memory growth, serialization/copies, generated code quality, and runtime tiering/JIT/AOT mode.

## Core knowledge
Wasm performance spans guest code, compiler output, runtime optimization, host boundary crossings, memory behavior, and external I/O. Warm and cold behavior can differ substantially.

## Procedure
1. Define measurable target and representative workload.
2. Establish repeatable cold and warm baselines.
3. Separate compile, instantiate, guest execution, host calls, and I/O.
4. Capture profiles using runtime/browser-native tooling.
5. Identify dominant costs by evidence.
6. Inspect generated Wasm around hot paths.
7. Form one optimization hypothesis at a time.
8. Benchmark the change against baseline with variance reported.
9. Check memory and correctness regressions.
10. Retain benchmark and environment metadata.

## Decision points
Optimize boundary batching before low-level instruction tuning when host crossings dominate. Use AOT when startup predictability matters and deployment permits; JIT/tiering may favor long-lived workloads.

## Common failure patterns
Benchmarking debug builds; tiny synthetic inputs; ignoring warmup; measuring wall time with unrelated I/O; changing several variables at once; claiming wins inside noise.

## Verification
Use repeated measurements, confidence/variance, representative production-like data, correctness tests, and before/after profiles.

## Expected output
An evidence-backed bottleneck diagnosis and quantified optimization with reproducible benchmark instructions.

## Stop conditions
Stop when workload representativeness is unknown, measurement noise exceeds expected gain, or optimization requires unsafe semantic changes.