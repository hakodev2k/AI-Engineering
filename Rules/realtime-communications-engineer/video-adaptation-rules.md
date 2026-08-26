# Video Adaptation Rules

## Purpose
Adapt video quality predictably to network, device, and layout constraints.

## Scope
Resolution, frame rate, bitrate, simulcast, SVC, layer selection, and keyframes.

## MUST
- Layer configuration MUST match endpoint encoding capability and server forwarding behavior.
- Receivers MUST request or select only layers they can decode and use.
- Adaptation MUST account for bandwidth, decoder load, viewport demand, and thermal constraints where observable.
- Layer switches MUST avoid unnecessary keyframe storms and prolonged freezes.

## MUST NOT
- MUST NOT send high-resolution layers solely because they are available.
- MUST NOT assume simulcast/SVC semantics are identical across codecs and clients.
- MUST NOT increase quality without congestion headroom.

## SHOULD
- Prefer stable visual quality over frequent resolution oscillation.

## Exceptions
Fixed-quality modes require explicit capacity and device constraints.

## Verification
Use layer/bitrate stats, packet captures, viewport tests, network emulation, device profiling, and visual regression sessions.