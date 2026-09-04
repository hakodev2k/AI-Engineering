# Speaker Diarization

## Purpose
Segment multi-speaker audio into speaker-homogeneous regions and assign consistent speaker labels with production-grade robustness.

## When to use
Use for meetings, calls, interviews, media transcription, or any workflow requiring who-spoke-when information.

## Inputs
- Multi-speaker recordings
- Optional reference speakers
- Expected speaker-count range
- Channel information
- Diarization evaluation set

## Context to inspect
Inspect overlap frequency, channel layout, reverberation, speaker-turn duration, cross-talk, background noise, and whether speakers recur across sessions.

## Core knowledge
Diarization usually combines speech activity detection, segmentation, speaker embeddings, clustering, overlap handling, and optional resegmentation. DER can hide the operational importance of speaker swaps or overlap failures.

## Procedure
1. Define diarization output granularity and speaker-label semantics.
2. Validate VAD/segmentation quality first.
3. Extract speaker embeddings from sufficiently informative windows.
4. Select clustering strategy and speaker-count assumptions.
5. Tune clustering thresholds on held-out sessions.
6. Handle overlapping speech explicitly where required.
7. Apply temporal smoothing or resegmentation cautiously.
8. Evaluate long meetings, short turns, and same-gender/similar-voice speakers.
9. Measure downstream ASR attribution quality.
10. Inspect speaker swaps manually on representative sessions.

## Decision points
Use known speaker count only when reliable metadata exists. Prefer overlap-aware diarization for meetings and calls with frequent cross-talk. Use channel information when it reflects actual speaker separation.

## Common failure patterns
- Treating VAD errors as clustering errors
- Over-fragmenting a single speaker
- Merging acoustically similar speakers
- Ignoring overlap
- Tuning on short, clean recordings only

## Verification
Verify DER components, speaker confusion, missed/false speech, overlap performance, and downstream speaker-attributed transcript quality.

## Expected output
A diarization pipeline with tuned segmentation/clustering settings, evaluation by failure mode, and deployment assumptions.

## Stop conditions
Stop if speaker identity boundaries are not operationally meaningful, source audio lacks enough speaker information, or evaluation annotations are unreliable.