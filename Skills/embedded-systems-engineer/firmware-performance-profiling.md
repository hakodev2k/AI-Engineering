# Firmware Performance Profiling

## Purpose
Find and fix CPU, latency, throughput, memory-bandwidth, and energy bottlenecks using measurements rather than intuition.

## When to use
Use for missed deadlines, high CPU, slow processing, dropped data, battery impact, or optimization work.

## Inputs
Performance requirement, representative workload, optimized build, traces/counters, timing instrumentation, and hardware configuration.

## Context to inspect
Inspect hot paths, ISR load, scheduler activity, copies, memory access, peripheral waits, clock configuration, DMA, compiler optimization, and algorithmic complexity.

## Core knowledge
Embedded performance is system-level: CPU cycles, memory/bus contention, interrupts, peripheral latency, and power modes interact. Optimization must preserve determinism and correctness.

## Procedure
1. Define the failing metric and target.
2. Reproduce with a representative optimized build.
3. Measure end-to-end latency/throughput first.
4. Attribute time to tasks, ISRs, waits, and hot functions.
5. Identify whether the bottleneck is compute, memory, I/O, scheduling, or contention.
6. Choose the lowest-risk high-impact change.
7. Benchmark before/after under identical conditions.
8. Recheck memory, timing, energy, and correctness regressions.

## Decision points
Improve algorithms before micro-optimizing instructions. Use DMA/hardware acceleration when data movement/compute dominates and complexity is justified. Increase clock only after understanding energy/thermal impact.

## Common failure patterns
Profiling debug builds, optimizing unmeasured code, removing safety checks blindly, benchmarking unrealistic inputs, and reporting average improvement while worst-case regresses.

## Verification
Record repeatable before/after measurements including worst-case behavior and resource trade-offs; rerun functional and timing tests.

## Expected output
A performance report with bottleneck evidence, change rationale, measured improvement, and regression checks.

## Stop conditions
Stop when workload, target metric, or measurement method is not representative enough to support a decision.