# Metadata and Caption Rules

## Purpose
Preserve correctness and accessibility of timed metadata, subtitles, captions, ad markers, and auxiliary tracks.

## Scope
Timed text, accessibility tracks, cue timing, language metadata, SCTE-style markers, ID3/event metadata, and manifest signaling.

## MUST
- Timed metadata MUST use a documented timeline and remain synchronized through transcode, packaging, discontinuities, and clipping.
- Caption and subtitle language, role, default, and accessibility signaling MUST be preserved according to supported output contracts.
- Metadata parsers MUST validate lengths, timestamps, encoding, and untrusted payload boundaries.
- Transformations that drop or rewrite metadata MUST be intentional, documented, and tested.

## MUST NOT
- MUST NOT silently discard accessibility tracks or contractual ad/event markers.
- MUST NOT execute or trust embedded metadata as code or authorization input without explicit validation.
- MUST NOT infer metadata correctness from video/audio playback success.

## SHOULD
- Metadata preservation SHOULD be covered by automated golden-stream regression tests.
- User-visible captions SHOULD be checked for representative synchronization and rendering behavior.

## Exceptions
Unsupported metadata requires documented product impact, fallback, and stakeholder approval when accessibility or contractual behavior is affected.

## Verification
Inspect manifests and payloads, run timing tests, caption rendering tests, malformed metadata tests, and golden-stream comparisons.