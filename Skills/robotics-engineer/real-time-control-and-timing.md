# Real-Time Control and Timing

## Purpose
Engineer deterministic control paths with bounded latency, jitter, and deadline behavior appropriate to physical robot dynamics.

## When to use
Use when control quality depends on predictable scheduling, when deadlines are missed, or when integrating real-time and best-effort workloads.

## Inputs
Control periods, deadline budgets, compute platform, OS/runtime, communication path, interrupt sources, workload measurements.

## Preconditions
Required timing guarantees are explicit and hardware clocks can be measured.

## Context to inspect
Thread priorities, scheduler, CPU affinity, memory allocation, logging, locks, network transport, device interrupts, GC/runtime behavior.

## Core knowledge
Average latency is insufficient for real-time systems; worst-case and tail behavior matter. Priority inversion, blocking I/O, dynamic allocation, page faults, and shared-resource contention can break deadlines.

## Procedure
1. Classify hard, firm, and soft real-time tasks.
2. Define periods, deadlines, and jitter budgets.
3. Instrument end-to-end execution and communication latency.
4. Identify blocking calls, locks, allocations, and unbounded work.
5. Assign priorities and CPU resources according to criticality.
6. Isolate non-critical logging, UI, and batch work.
7. Bound queues and backpressure behavior.
8. Test under CPU, memory, network, and I/O stress.
9. Record percentile and worst observed timing.
10. Define deadline-miss detection and safe degradation.

## Decision points
Use an RTOS or real-time kernel when measured worst-case behavior on a general-purpose stack cannot meet requirements. Keep high-level autonomy outside hard real-time loops unless evidence requires otherwise.

## Common failure patterns
Optimizing averages, unbounded callbacks, priority inversion, high-priority logging, dynamic allocation in critical loops, and treating network delivery as deterministic.

## Verification
Measure deadline-miss rate, jitter, end-to-end latency, and recovery under representative worst-case load.

## Expected output
Timing budget, scheduling configuration, latency measurements, and deadline-failure policy.

## Stop conditions
Stop when required deadlines cannot be demonstrated or when real-time changes would compromise system safety without platform-level redesign.