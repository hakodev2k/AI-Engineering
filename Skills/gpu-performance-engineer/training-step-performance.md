# Training Step Performance

## Purpose
Optimize GPU training step time while preserving convergence, numerical behavior, reproducibility requirements, and distributed scaling characteristics.

## When to use
Use when training throughput regresses, GPU utilization is low, step-time variance is high, or compute/communication/memory costs need rebalancing.

## Inputs
- Representative training configuration
- Model, optimizer, sequence/image sizes, and batch semantics
- Step-time breakdown and profiler traces
- Distributed topology
- Convergence and numerical-quality baselines

## Context to inspect
Inspect forward/backward/optimizer phases, input pipeline, gradient accumulation, activation memory, recomputation, precision, collectives, synchronization, compilation, and checkpoint overhead.

## Core knowledge
Training performance is a system property. Improving kernel speed may not improve step time when data loading, communication, optimizer state, memory pressure, or synchronization dominates. Changes to effective batch size can change convergence and must not be treated as pure performance tuning.

## Procedure
1. Freeze model semantics and effective batch definition.
2. Measure steady-state step time and variance.
3. Decompose input, forward, backward, communication, optimizer, and synchronization time.
4. Identify exposed communication and GPU idle regions.
5. Tune precision and optimized operator paths with convergence checks.
6. Evaluate gradient accumulation, checkpointing, and activation recomputation as memory/performance trade-offs.
7. Improve input pipeline only when starvation is measured.
8. Tune distributed bucket sizes and overlap when communication is material.
9. Benchmark multiple representative model/input sizes.
10. Validate several training windows for loss/metric equivalence, not just one step.

## Decision points
Use recomputation when memory enables materially larger efficient batches and extra compute is cheaper than memory pressure. Use accumulation when memory limits batch size but account for optimizer/update semantics. Change parallelism strategy when communication is structurally dominant.

## Common failure patterns
- Changing effective batch size without convergence validation
- Profiling startup or compilation rather than steady state
- Treating data-loader tuning as a default fix
- Hiding synchronization in aggregate step metrics
- Reporting examples/sec without accounting for sequence/token workload changes

## Verification
Confirm lower stable step time, unchanged intended training semantics, acceptable convergence over a meaningful window, and sustained distributed scaling.

## Expected output
A training-performance report and validated changes with phase-level timing, throughput, memory, scaling, and convergence evidence.

## Stop conditions
Stop if performance changes alter required training semantics or convergence beyond accepted tolerance, or if bottlenecks require unsupported infrastructure changes.