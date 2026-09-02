# Real-Time I/O and Device Interaction

## Purpose
Design device interaction so sensor/actuator paths meet timing, ordering, and failure requirements without hidden blocking or uncontrolled bus contention.

## When to use
Use for SPI/I2C/UART/CAN/PCIe/MMIO devices, sensor acquisition, actuator control, DMA pipelines, or driver-related latency issues.

## Inputs
Device datasheets, bus speeds, transfer sizes, deadlines, driver APIs, DMA capabilities, interrupt behavior, electrical constraints.

## Context to inspect
Driver stack, bus arbitration, retries, DMA descriptors, buffering, polling, interrupts, cache coherency, and error recovery.

## Core knowledge
I/O latency includes queueing, arbitration, transfer time, device response, driver overhead, interrupt/deferred work, and retries. DMA reduces CPU occupancy but introduces setup, coherency, and completion concerns.

## Procedure
1. Map the end-to-end I/O path and deadline.
2. Compute nominal and worst-case transfer costs.
3. Identify blocking, arbitration, and retry behavior.
4. Choose polling, interrupt, or DMA based on rate and deadline.
5. Bound buffer depth and overflow semantics.
6. Define device timeout, reset, and degraded-mode behavior.
7. Handle cache coherency and memory barriers where required.
8. Test bus saturation and competing devices.
9. Measure event-to-consumption or command-to-actuation latency.

## Decision points
Polling may be best for very short bounded waits; interrupts reduce CPU use for sparse events; DMA suits larger or frequent transfers when setup and coherency costs are justified.

## Common failure patterns
Unbounded driver retries, blocking high-priority tasks, silent buffer overflow, incorrect DMA ownership, bus priority starvation, and assuming datasheet typical timing is worst case.

## Verification
Stress the bus and device on target hardware, inject errors/timeouts, and verify latency, data integrity, and recovery behavior.

## Expected output
A bounded I/O design with transfer budgets, buffering, failure semantics, and timing evidence.

## Stop conditions
Stop when device or bus behavior lacks enough specification or measurement evidence to bound the critical path.