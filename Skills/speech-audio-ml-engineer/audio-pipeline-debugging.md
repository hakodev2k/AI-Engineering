# Audio Pipeline Debugging

## Purpose
Diagnose end-to-end speech/audio failures across capture, transport, decoding, preprocessing, model inference, and postprocessing.

## When to use
Use for production regressions, corrupted audio, timestamp errors, inexplicable model degradation, or environment-specific failures.

## Inputs
Failing samples, logs, configs, model versions, pipeline code, known-good baseline, environment metadata.

## Context to inspect
Inspect byte format, codec, sample rate, channels, endianness, resampling, chunk boundaries, timestamps, normalization, model inputs, and postprocessing.

## Core knowledge
Many apparent ML failures are signal-pipeline defects. Debug from raw bytes toward model output and compare intermediate artifacts with a known-good path.

## Procedure
1. Reproduce one minimal failing case.
2. Preserve original bytes and metadata.
3. Decode independently and listen/inspect waveform.
4. Compare each pipeline stage against known-good output.
5. Validate shapes, ranges, clocks, sample counts, and state boundaries.
6. Isolate the first divergent stage.
7. Fix the cause, not downstream symptoms.
8. Add a deterministic regression fixture.
9. Re-run broader evaluation.

## Decision points
Use binary/sample-level comparison for deterministic DSP; tolerance-based comparison for floating-point transforms. Disable optimizations temporarily when they obscure causality.

## Common failure patterns
Double resampling, wrong channel assumptions, integer overflow, endian errors, stale streaming state, timestamp drift, and debugging only final transcripts.

## Verification
The minimal fixture passes, intermediate artifacts match expectations, and broader metrics recover without regression.

## Expected output
A root cause, minimal reproduction, corrective change, and regression protection.

## Stop conditions
Escalate when source bytes are unavailable, production access is required, or evidence suggests upstream corruption outside ownership.