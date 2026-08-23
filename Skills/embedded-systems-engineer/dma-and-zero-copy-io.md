# DMA and Zero-Copy I/O

## Purpose
Use DMA and buffer ownership safely to reduce CPU overhead while preserving data integrity, timing, and cache coherence.

## When to use
Use for high-rate ADC, serial, networking, audio, display, storage, or CPU-bound data movement.

## Inputs
DMA controller documentation, peripheral configuration, buffer sizes, cache architecture, throughput requirements, and traces.

## Context to inspect
Inspect channel mapping, transfer descriptors, alignment, circular/double buffers, interrupts, cache maintenance, memory accessibility, and ownership transitions.

## Core knowledge
DMA creates concurrency between hardware and CPU. Buffers need explicit ownership and lifetime. Cached systems may require clean/invalidate operations and barriers. Zero-copy reduces copying but tightens lifecycle coupling.

## Procedure
1. Quantify transfer rate and CPU-copy cost.
2. Confirm DMA-accessible memory and alignment.
3. Define buffer ownership states.
4. Select normal, circular, scatter-gather, or double buffering.
5. Define completion/error signaling.
6. Apply required cache maintenance and barriers.
7. Handle partial, overrun, and cancellation cases.
8. Measure throughput, latency, CPU load, and corruption under stress.

## Decision points
Use DMA when transfer volume or timing warrants setup complexity. Prefer copying when payloads are small and ownership simplicity is more valuable. Use zero-copy only with a clear lifetime protocol.

## Common failure patterns
CPU touching hardware-owned buffers, missing cache invalidation, stack buffers used asynchronously, descriptor reuse too early, ignoring transfer errors, and DMA to inaccessible memory.

## Verification
Stress sustained transfers, verify buffer contents and sequence, measure CPU savings, and test cache-enabled optimized builds.

## Expected output
A documented DMA pipeline with buffer lifecycle, cache rules, error handling, and measured benefit.

## Stop conditions
Stop when DMA memory/coherency requirements or peripheral transfer semantics are unknown.