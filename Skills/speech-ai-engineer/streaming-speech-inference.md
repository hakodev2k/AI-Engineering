# Streaming Speech Inference

## Purpose
Engineer speech models and serving pipelines that process audio incrementally while balancing latency, accuracy, state management, and throughput.

## When to use
Use for conversational ASR, live captions, voice assistants, simultaneous translation, and real-time speech analytics.

## Inputs
- Streaming model or candidate architecture
- Chunking configuration
- Latency SLOs
- Network and device constraints
- Representative live audio

## Context to inspect
Inspect model lookahead, receptive field, chunk size, state caching, endpointing, partial hypotheses, backpressure, jitter, reconnect behavior, and transport framing.

## Core knowledge
Streaming quality depends on algorithmic latency plus capture, transport, buffering, feature extraction, inference, decoding, and endpointing. Smaller chunks reduce delay but increase scheduling overhead and may reduce context.

## Procedure
1. Decompose end-to-end latency into measurable stages.
2. Define acceptable partial and final transcript behavior.
3. Select chunk size and lookahead from model constraints.
4. Implement per-session state lifecycle explicitly.
5. Handle missing, late, duplicated, and out-of-order audio frames.
6. Bound buffering and apply backpressure.
7. Measure partial-hypothesis churn and endpoint latency.
8. Load-test concurrent sessions with realistic utterance lengths.
9. Validate reconnection and session cleanup.
10. Instrument queueing, inference, decode, and network latency separately.

## Decision points
Increase lookahead only when accuracy gains justify interaction delay. Keep state server-side when clients cannot safely maintain it; prefer client/on-device inference when privacy or network reliability dominates.

## Common failure patterns
- Measuring model latency but not end-to-end latency
- Leaking session state after disconnects
- Unbounded audio queues
- Chunk settings tuned only on short utterances
- Unstable partial hypotheses harming UX

## Verification
Verify p50/p95/p99 end-to-end latency, real-time factor, transcript quality, resource use, session isolation, and degraded-network behavior.

## Expected output
A streaming inference design with chunk/state policy, latency budget, load-test evidence, and failure handling.

## Stop conditions
Stop if model architecture requires more future context than the product latency permits or session state cannot be isolated reliably.