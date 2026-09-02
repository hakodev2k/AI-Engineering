# Streaming Inference

## Purpose
Design continuous inference loops that process live sensor streams with bounded latency, stable resource use, explicit backpressure, and correct temporal state.

## When to use
Use for video, audio, telemetry, sequence models, sliding-window inference, or any edge workload where inputs arrive continuously rather than as independent requests.

## Inputs
Input rates, model window/stride, latency deadline, runtime API, stateful model semantics, device resources, and output-consumer requirements.

## Preconditions
Define whether freshness, completeness, or temporal continuity has priority when processing cannot keep up.

## Context to inspect
Capture queues, ring buffers, model state, timestamps, batching, asynchronous execution, output queues, frame/sample dropping, and restart behavior.

## Core knowledge
Streaming systems fail through queue growth as often as through slow kernels. Processing rate must exceed arrival rate over sustainable periods or the system needs explicit shedding. Stateful inference requires lifecycle rules for reset, discontinuity, missing samples, and model replacement.

## Procedure
1. Calculate arrival rate and required processing service rate.
2. Define maximum acceptable input age and queue depth.
3. Select window size and stride from model semantics and latency budget.
4. Use bounded ring buffers or queues.
5. Define drop/coalescing policy before overload occurs.
6. Preserve timestamps and sequence identifiers.
7. Handle state initialization, reset, gaps, and device suspend/resume explicitly.
8. Pipeline capture, preprocessing, inference, and postprocessing only where ordering remains correct.
9. Measure queue wait separately from execution time.
10. Test overload, burst, sensor restart, and slow-consumer scenarios.
11. Expose dropped-input and stale-output metrics.

## Decision points
Prefer newest-data processing for control-like workloads; prefer completeness for offline-quality capture. Batch only when it improves total service rate without violating freshness. Maintain recurrent state only when continuity can be guaranteed or reset semantics are robust.

## Common failure patterns
Unbounded queues, silently processing stale frames, state carried across discontinuities, latency tests with no sustained stream, and parallelism that reorders outputs.

## Verification
Run long streams above, at, and below nominal load; measure input age, queue depth, drop rate, output ordering, and recovery after discontinuities.

## Expected output
A bounded streaming pipeline with defined overload semantics, temporal-state lifecycle, and verified latency behavior.

## Stop conditions
Stop when the required arrival rate exceeds sustainable device capacity and no approved shedding or model simplification strategy exists.