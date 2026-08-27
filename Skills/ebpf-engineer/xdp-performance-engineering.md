# XDP Performance Engineering

## Purpose
Measure and optimize XDP datapaths without sacrificing packet correctness or operational safety.

## When to use
Use when XDP throughput, CPU, drops, or tail latency fail objectives.

## Inputs
Traffic profiles, CPU/NIC topology, program instructions, map access patterns, benchmark results, driver mode.

## Context to inspect
Inspect native/generic/offload mode, RSS, NUMA, IRQ placement, map contention, helper use, branch patterns, packet sizes, and baseline networking cost.

## Core knowledge
PPS, cycles/packet, cache locality, map contention, and driver mode matter more than micro-optimizing source syntax. Benchmarks must preserve realistic distributions.

## Procedure
1. Establish baseline with and without the program.
2. Reproduce realistic packet-size and flow distributions.
3. Measure per-CPU PPS, drops, cycles, and tail behavior.
4. Identify hot helpers, map operations, parsing, and branches.
5. Reduce work on the common path while preserving checks.
6. Improve map locality/contention where evidence supports it.
7. Retest under NUMA and CPU-affinity variants.
8. Compare native/generic modes where relevant.
9. Record regression thresholds.

## Decision points
Optimize map strategy before adding complexity when contention dominates. Prefer early exits for common cases. Hardware offload is justified only with operational tooling and semantic equivalence.

## Common failure patterns
Synthetic single-flow benchmarks, ignoring NUMA, removing safety checks, optimizing average PPS while worsening drops, and benchmarking generic mode unintentionally.

## Verification
Repeatable A/B benchmarks with confidence ranges, correctness traffic, sustained load, and resource measurements.

## Expected output
Evidence-backed optimization with quantified before/after cost.

## Stop conditions
Stop when further gains require semantic compromise, unsupported hardware assumptions, or exceed complexity budget.