# Resource-Constrained Runtime

## Purpose
Engineer edge workloads that remain stable within strict CPU, memory, storage, power, and thermal limits.

## When to use
Use when deploying software to gateways, appliances, single-board systems, industrial PCs, or other resource-constrained nodes.

## Inputs
Hardware profile, workload characteristics, performance targets, power/thermal limits, runtime dependencies.

## Context to inspect
Inspect process memory, threads, file descriptors, disk growth, GC behavior, CPU saturation, thermal throttling, and startup time.

## Core knowledge
Senior edge runtime design requires budgeting resources, bounding concurrency, avoiding unbounded buffers, understanding runtime overhead, and degrading gracefully before resource exhaustion.

## Procedure
1. Establish measurable resource budgets.
2. Profile steady-state and peak consumption.
3. Identify unbounded queues, caches, logs, and temporary files.
4. Bound concurrency and worker counts.
5. Minimize dependency and runtime footprint where material.
6. Define memory and disk pressure behavior.
7. Protect critical control paths from optional workloads.
8. Measure thermal and power effects where relevant.
9. Add resource saturation telemetry.
10. Stress-test beyond expected peaks.

## Decision points
Trade throughput for bounded resource use when stability is more important than peak speed. Prefer simpler runtimes when operational constraints outweigh framework convenience.

## Common failure patterns
Memory leaks, log-filled disks, runaway retries, oversized caches, thread explosion, thermal throttling.

## Verification
Run sustained soak and overload tests and prove bounded memory, storage, CPU, and recovery behavior.

## Expected output
A resource budget and implementation validated against normal, peak, and overload conditions.

## Stop conditions
Stop when hardware limits cannot satisfy required workload even after evidence-based optimization.