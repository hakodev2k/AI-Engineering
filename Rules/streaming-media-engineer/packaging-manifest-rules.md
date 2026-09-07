# Packaging and Manifest Rules

## Purpose
Ensure segmented media and manifests remain internally consistent, standards-compatible, cacheable, and recoverable.

## Scope
HLS, DASH, CMAF or equivalent packaging, playlists/manifests, segments, initialization data, and metadata signaling.

## MUST
- Segment references, durations, sequence numbers, discontinuities, initialization data, and codec declarations MUST be internally consistent.
- Manifest generation MUST handle partial failures without advertising unavailable media.
- Packaging changes MUST be tested against supported players and validators before broad release.
- Live window retention and eviction behavior MUST be explicitly defined.

## MUST NOT
- MUST NOT publish references before required media is durably available under the delivery consistency model.
- MUST NOT mutate immutable segment objects in place when caches can retain prior bytes.
- MUST NOT depend on undocumented player tolerance for malformed output.

## SHOULD
- Common media segments SHOULD be reused across protocols when this reduces duplication without harming compatibility.
- Manifest size and update frequency SHOULD be bounded.

## Exceptions
Non-standard signaling requires documented interoperability evidence and fallback behavior.

## Verification
Run standards validators, manifest/segment consistency checks, cache tests, supported-player E2E tests, and live-window failure scenarios.