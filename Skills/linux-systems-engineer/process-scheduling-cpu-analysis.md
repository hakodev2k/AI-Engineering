# Process Scheduling and CPU Analysis

## Purpose
Identify CPU bottlenecks, scheduler contention, throttling, and pathological process behavior.

## When to use
Use for high CPU, latency spikes, run-queue growth, CPU throttling, or uneven core utilization.

## Inputs
Workload expectations, process list, CPU topology, cgroup limits, utilization and latency metrics.

## Context to inspect
Inspect affinity, NUMA topology, quotas, priorities, interrupts, virtualization steal time, thread counts, and recent deployments.

## Core knowledge
Distinguish utilization from saturation; understand run queues, nice levels, CFS behavior, context switching, IRQ/softirq work, CPU steal, affinity, quotas, and frequency scaling.

## Procedure
1. Establish workload and latency baseline.
2. Measure per-CPU and per-process utilization.
3. Check run queues, context switches, steal, IRQ load, and throttling.
4. Identify hot processes and threads.
5. Inspect affinity, priority, quotas, and CPU topology.
6. Profile hot code only after system-level localization.
7. Test whether contention, computation, spinning, or throttling dominates.
8. Correct configuration or application behavior.
9. Re-run representative load and compare.

## Decision points
Scale out when parallelizable demand exceeds safe host capacity; optimize code when profiles show concentrated waste; adjust affinity only with topology evidence.

## Common failure patterns
Equating 100% of one core with host saturation, increasing priority indiscriminately, ignoring steal time, excessive thread counts, and masking inefficient code with more CPU.

## Verification
Compare p95/p99 latency, throughput, run-queue depth, throttling, CPU utilization, and profile samples before and after.

## Expected output
Localized CPU/scheduler cause, justified remediation, and measured impact.

## Stop conditions
Stop if profiling risks sensitive data, production load cannot tolerate instrumentation, or hypervisor-level evidence requires another owner.