# Codec and Transcoding Rules

## Purpose
Control media quality, compatibility, compute cost, and failure behavior during encode, decode, and transcode operations.

## Scope
Video/audio codecs, encoder settings, hardware acceleration, transcoding graphs, and codec migration.

## MUST
- Codec profiles, levels, pixel/sample formats, channel layouts, and encoder parameters MUST match supported playback targets.
- Quality or efficiency changes MUST be supported by objective measurements on representative content.
- Hardware-accelerated paths MUST define fallback and failure behavior where availability requires it.
- Encoder upgrades MUST be regression-tested for quality, bitrate, latency, determinism requirements, and decoder compatibility.

## MUST NOT
- MUST NOT claim bitrate savings or quality improvement without comparative evidence.
- MUST NOT accept unbounded media parameters that can exhaust memory, CPU, or accelerator capacity.
- MUST NOT silently change output codec semantics across an existing contract.

## SHOULD
- Content-aware encoding SHOULD be considered when its operational complexity is justified by measured benefit.
- Presets SHOULD be versioned and reproducible.

## Exceptions
Deviations require documented target constraints, measurements, compatibility risk, and rollout plan.

## Verification
Use quality metrics, visual review where appropriate, bitrate/latency benchmarks, decoder matrices, load tests, and regression corpora.