# Timestamp and Clock Rules

## Purpose
Preserve temporal correctness across capture, transcode, packaging, distribution, and playback.

## Scope
PTS/DTS handling, wall clocks, monotonic clocks, synchronization, discontinuities, drift, and timeline conversion.

## MUST
- Components MUST document which clock domain each timestamp uses and how conversions occur.
- Timestamp arithmetic MUST handle wraparound, discontinuities, reordering, and invalid values explicitly.
- Synchronization-sensitive changes MUST be validated for audio/video drift and long-duration behavior.
- Wall-clock time MUST NOT be used for elapsed-time decisions when a monotonic clock is required.

## MUST NOT
- MUST NOT rewrite timestamps merely to hide upstream defects without recording the correction policy.
- MUST NOT assume timestamps are monotonic across reconnects or source changes.
- MUST NOT discard discontinuity evidence needed by downstream systems.

## SHOULD
- Clock drift SHOULD be measured over representative stream durations.
- Timeline normalization SHOULD happen at a clearly owned boundary.

## Exceptions
Any intentional timestamp repair requires documented rationale, bounded behavior, and compatibility evidence.

## Verification
Inspect timestamp traces, long-run synchronization tests, discontinuity tests, reconnect tests, and player telemetry.