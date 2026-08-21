# Concurrency and Contention Analysis

## Purpose
Identify throughput and latency losses caused by locks, queues, thread starvation, shared state, excessive parallelism, or synchronization bottlenecks.

## When to use
Use when performance worsens as concurrency rises, CPU is underutilized despite backlog, threads wait excessively, or latency shows contention patterns.

## Inputs
Thread/runtime traces, lock metrics, queue lengths, pool metrics, workload concurrency, architecture, and code around shared resources.

## Context to inspect
Inspect locks, semaphores, thread pools, connection pools, executors, shared caches, database transactions, rate limiters, and blocking I/O.

## Core knowledge
Concurrency increases useful parallelism only until a constrained shared resource dominates. Little's Law, queueing, critical-section duration, and pool sizing are central. More threads can reduce throughput through contention and context switching.

## Procedure
1. Reproduce degradation across increasing concurrency levels.
2. Plot throughput, latency, queue length, and utilization.
3. Capture thread or async task states during saturation.
4. Identify dominant waits and serialized critical sections.
5. Measure pool occupancy and acquisition time.
6. Inspect blocking calls inside async or locked paths.
7. Reduce critical-section scope or shared mutable state where appropriate.
8. Bound concurrency to protect constrained dependencies.
9. Retest the concurrency curve.
10. Validate fairness, correctness, and failure behavior.

## Decision points
Prefer removing contention over increasing pool sizes. Increase pools only when the downstream resource can sustain the added parallelism.

## Common failure patterns
Increasing threads blindly, lock-free redesign without evidence, holding locks during I/O, unbounded task creation, and tuning one pool while another dependency remains constrained.

## Verification
Show improved throughput/latency at target concurrency with reduced wait time and no correctness or dependency regressions.

## Expected output
A contention model, identified bottleneck, and verified concurrency policy or code change.

## Stop conditions
Stop when concurrency changes could violate ordering, consistency, or external rate constraints without owner approval.