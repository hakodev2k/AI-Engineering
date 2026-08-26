# Audio Processing Rules

## Purpose
Preserve intelligibility and natural conversation across devices and environments.

## Scope
AEC, noise suppression, automatic gain control, device routing, sampling, and audio levels.

## MUST
- Echo cancellation assumptions MUST be validated on supported capture/playback paths.
- Audio processing changes MUST be evaluated for speech intelligibility, artifacts, and CPU impact.
- Device changes MUST preserve session state or fail with recoverable user-visible behavior.
- Clipping, sustained silence, and abnormal levels MUST be observable where privacy policy permits.

## MUST NOT
- MUST NOT stack incompatible processing stages without validation.
- MUST NOT record raw audio for diagnostics without explicit authorization and privacy controls.
- MUST NOT tune solely for one device class.

## SHOULD
- Test representative headsets, speakers, microphones, Bluetooth paths, and noisy environments.

## Exceptions
Device-specific processing requires bounded targeting and regression coverage.

## Verification
Use acoustic tests, device matrices, CPU profiling, audio metrics, and controlled listening evaluation.