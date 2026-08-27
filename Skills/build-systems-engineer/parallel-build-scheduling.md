# Parallel Build Scheduling

## Purpose
Increase build throughput and reduce wall time through safe, resource-aware parallel execution.

## When to use
Use when traces show idle resources, excessive serialization, or oversubscription that degrades performance.

## Inputs
Build DAG, action resource profiles, machine/worker capacity, timings, and concurrency controls.

## Context to inspect
Inspect graph edges, job pools, CPU/memory/I/O usage, linker pressure, remote queues, exclusive resources, and test/build contention.

## Core knowledge
Maximum task count is not optimal concurrency. Scheduling must respect dependencies and scarce resources. Memory-heavy linkers or I/O-heavy actions can make oversubscription slower or unstable.

## Procedure
1. Measure current utilization and critical path.
2. Identify unnecessary serialization edges.
3. Classify actions by CPU, memory, I/O, network, and exclusivity.
4. Define resource-aware concurrency limits or pools.
5. Prioritize critical-path-ready actions when supported.
6. Avoid shared mutable outputs.
7. Coordinate local and remote capacity.
8. Stress test under realistic developer and CI workloads.
9. Monitor OOM, throttling, queue time, and tail latency.
10. Tune limits using measured wall time rather than task count.

## Decision points
Use conservative pools for high-memory linkers and generators; broader concurrency for independent CPU tasks when capacity allows. Prefer graph fixes over arbitrary sleeps/order constraints.

## Common failure patterns
Setting jobs equal to CPU count regardless of memory, parallel writes to shared directories, starving critical-path actions, and assuming remote workers have homogeneous capacity.

## Verification
Compare wall time and utilization before/after; run repeated parallel builds; verify deterministic artifacts; confirm no increase in OOM/flakiness.

## Expected output
A resource-aware scheduling policy with measured latency and stability results.

## Stop conditions
Stop if action resource usage cannot be characterized, parallelism exposes unresolved data races, or infrastructure quotas require external approval.