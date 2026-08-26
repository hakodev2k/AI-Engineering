# Speaker Diarization

## Purpose
Determine who spoke when in multi-speaker recordings with reliable segmentation and clustering.

## When to use
Use for meetings, calls, interviews, media, or ASR pipelines requiring speaker attribution.

## Inputs
Multi-speaker audio, reference RTTM/segments when available, overlap requirements, latency target.

## Context to inspect
Inspect VAD, segmentation, speaker embeddings, clustering, overlap handling, channel information, and session lengths.

## Core knowledge
Diarization combines speech activity detection, segmentation, embeddings, clustering, and often overlap detection. DER components should be inspected separately.

## Procedure
1. Define collar, overlap, and scoring conventions.
2. Establish VAD and diarization baseline.
3. Separate miss, false alarm, and confusion errors.
4. Tune segmentation and embedding windows.
5. Select clustering using development sessions.
6. Handle overlapping speech according to product needs.
7. Test variable speaker counts and long sessions.
8. Integrate with ASR using stable time bases.

## Decision points
Use offline clustering for global context; online diarization for streaming constraints. Exploit separate channels when trustworthy.

## Common failure patterns
Timestamp drift, over-segmentation, fixed speaker-count assumptions, overlap collapse, and tuning against inconsistent scoring rules.

## Verification
Report DER and component errors across speaker counts, overlap levels, environments, and durations.

## Expected output
A diarization pipeline with reproducible scoring and explicit latency assumptions.

## Stop conditions
Stop when reference timing is unreliable or required online latency conflicts with the chosen algorithm.