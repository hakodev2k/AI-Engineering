# Realtime Performance Profiling

## Purpose
Find CPU, memory, scheduling, rendering, encoding, packet-processing, and latency bottlenecks that degrade live media.

## When to use
Use for high CPU, thermal throttling, dropped frames, audio glitches, SFU saturation, or latency regressions.

## Inputs
Profiles, traces, runtime metrics, RTC stats, device/server specs, workload description, and baseline build.

## Core knowledge
Realtime performance is deadline-sensitive. Average throughput can look healthy while scheduler stalls, GC pauses, lock contention, encoder overload, packet bursts, or main-thread work causes perceptible failure.

## Procedure
1. Define the user-visible symptom and latency/deadline budget.
2. Capture a reproducible baseline workload.
3. Profile CPU, allocations, threads, locks, I/O, and relevant hardware acceleration.
4. Correlate stalls with audio underruns, frame drops, queue growth, or packet loss.
5. Separate sender, network, relay, and receiver constraints.
6. Form one bottleneck hypothesis.
7. Make the smallest measurable change.
8. Repeat identical workload and compare tails, not only averages.
9. Stress near capacity and verify graceful degradation.

## Decision points
Optimize only measured bottlenecks. Offload work when contention or deadlines justify complexity. Prefer reducing unnecessary work before adding concurrency, which can worsen scheduling and cache behavior.

## Common failure patterns
Premature optimization; profiling debug builds; averages hiding tail stalls; adding threads blindly; ignoring thermal behavior; confusing network loss with local packet drops.

## Verification
Demonstrate improved deadline adherence, CPU/memory behavior, frame/audio continuity, and unchanged correctness under repeatable load.

## Expected output
A measured bottleneck, causal evidence, implemented mitigation, and before/after profile.

## Stop conditions
Stop when reproduction is unstable, profiling changes behavior materially, or optimization requires unsafe production experimentation.