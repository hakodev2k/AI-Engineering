# DMA and Zero-Copy Data Paths

## Purpose
Use DMA and buffer ownership safely to reduce CPU overhead while preserving data correctness.

## When to use
Use for sustained I/O, sampling, communication or performance bottlenecks involving data movement.

## Inputs
Transfer requirements, DMA capabilities, memory/cache model, buffers and latency targets.

## Context to inspect
Channel ownership, alignment, cache maintenance, descriptor lifetime, completion signaling and error paths.

## Core knowledge
DMA introduces concurrent memory access. Buffer lifetime, cache coherency, alignment and ownership transitions must be explicit.

## Procedure
1. Measure whether data movement is a bottleneck.
2. Define producer/consumer ownership states.
3. Select buffers and alignment.
4. Configure bounded transfers.
5. Define completion and error signaling.
6. Handle coherency requirements.
7. Prevent reuse before completion.
8. Measure throughput, CPU use and latency.

## Decision points
Use zero-copy when copies materially cost CPU or latency; retain copies when they simplify ownership and fit budgets.

## Common failure patterns
Premature buffer reuse, stale cache data, misalignment, missing completion handling, descriptor corruption and optimizing without measurement.

## Verification
Stress sustained transfers, validate data integrity and compare CPU/latency metrics before and after.

## Expected output
A measured data path with explicit ownership and coherency rules.

## Stop conditions
Stop when memory coherency behavior or DMA constraints are undocumented for the target.