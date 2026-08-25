# Audio System Rules

## Purpose
Maintain responsive, intelligible, performant audio across gameplay states and hardware.

## Scope
Playback, mixing, spatial audio, voice limits, streaming, music, dialogue, and device changes.

## MUST
- Audio categories MUST have defined routing and controllable levels where player settings require them.
- Voice creation MUST be bounded by priority or virtualization policy.
- Streaming audio MUST handle underrun, device interruption, and lifecycle transitions safely.
- Dialogue or critical cues MUST remain intelligible under representative mixes.

## MUST NOT
- MUST NOT create unbounded simultaneous voices from gameplay events.
- MUST NOT couple gameplay correctness to successful noncritical audio playback.

## SHOULD
- Repetitive effects SHOULD use variation without compromising authored intent.
- Audio state transitions SHOULD avoid discontinuities unless intentional.

## Exceptions
Minimal-audio experiences may simplify routing when accessibility and platform requirements remain satisfied.

## Verification
Run voice-count profiling, device-switch tests, stress scenarios, mix reviews, streaming tests, and accessibility checks.