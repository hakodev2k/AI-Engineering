# Adaptive Bitrate Rules

## Purpose
Provide stable playback across heterogeneous devices and network conditions while preserving efficient delivery.

## Scope
ABR ladders, rendition alignment, switching constraints, player-facing manifests, and bitrate selection inputs.

## MUST
- Renditions intended for seamless switching MUST use compatible codec parameters and aligned switching boundaries.
- Ladder design MUST be justified by representative content, target devices, network conditions, and distribution cost.
- Rendition generation MUST detect missing, corrupt, or materially divergent outputs.
- Changes to ladder structure MUST assess cache impact, player compatibility, startup behavior, and quality transitions.

## MUST NOT
- MUST NOT generate redundant renditions whose measured quality gain does not justify cost.
- MUST NOT assume nominal bitrate equals delivered bandwidth requirement.
- MUST NOT expose a rendition known to violate target decoder constraints.

## SHOULD
- Per-title or content-aware ladders SHOULD be used only when validated against operational and playback objectives.
- Switching performance SHOULD be tested under realistic bandwidth variation.

## Exceptions
Fixed ladders or constrained profiles require documented device/business constraints and evidence.

## Verification
Compare quality curves, bitrate distributions, switch tests, manifest checks, player QoE, and CDN cost/traffic data.