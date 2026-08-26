# Streaming Speech Inference

## Purpose
Engineer stateful speech inference with bounded latency, stable memory, and correct chunk semantics.

## When to use
Use for live ASR, VAD, diarization, enhancement, or interactive speech systems.

## Inputs
Model, chunking requirements, hardware, concurrency, latency SLO, network behavior.

## Context to inspect
Inspect receptive fields, caches, buffering, endpointing, batching, transport, timestamps, and backpressure.

## Core knowledge
Streaming latency includes capture, buffering, preprocessing, model compute, decoding, transport, and endpoint delay. Average latency is insufficient; tail behavior matters.

## Procedure
1. Define first-token, partial, final, and end-to-end latency targets.
2. Trace all buffers and model state.
3. Establish chunked correctness against offline reference where applicable.
4. Profile each latency component.
5. Bound caches and session memory.
6. Handle disconnects, retries, and backpressure.
7. Test long sessions and concurrency.
8. Instrument production latency distributions.

## Decision points
Smaller chunks reduce buffering but increase overhead. Batching improves throughput but can violate interactive latency; use bounded dynamic batching only when SLO-safe.

## Common failure patterns
Timestamp drift, state leakage across sessions, unbounded buffers, finalization delays, hidden resampling cost, and p50-only optimization.

## Verification
Load-test p50/p95/p99 latency, memory per stream, long-session stability, and transcript equivalence.

## Expected output
A streaming pipeline meeting explicit correctness and latency SLOs.

## Stop conditions
Stop when model architecture intrinsically requires future context incompatible with the target latency.