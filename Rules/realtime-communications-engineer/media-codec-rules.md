# Media Codec Rules

## Purpose
Balance interoperability, quality, compute, bandwidth, and licensing constraints.

## Scope
Audio/video codec selection, profiles, packetization, simulcast/SVC compatibility, and fallback.

## MUST
- Codec policy MUST be based on supported endpoint capabilities and measured operating constraints.
- Mandatory interoperability codecs for supported platforms MUST remain test-covered.
- Profile, level, packetization, and hardware-acceleration assumptions MUST be validated.
- Codec changes affecting production quality or cost MUST have before/after evidence.

## MUST NOT
- MUST NOT force a codec unsupported by a negotiated endpoint.
- MUST NOT infer quality improvement from bitrate alone.
- MUST NOT ignore licensing or deployment constraints.

## SHOULD
- Prefer graceful codec fallback over session failure where requirements permit.

## Exceptions
Specialized codec choices require documented capability, cost, quality, and compatibility analysis.

## Verification
Use capability matrices, encoded-stream inspection, quality benchmarks, CPU measurements, and cross-endpoint calls.