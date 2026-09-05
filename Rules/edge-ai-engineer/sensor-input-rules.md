# Sensor Input Rules

## Purpose
Ensure models consuming device sensors receive valid, synchronized, and quality-bounded inputs.

## Scope
Camera, microphone, motion, location, environmental, and other sensor-derived inputs.

## MUST
- Sensor units, sampling rates, coordinate systems, timestamps, and expected quality bounds MUST be explicit.
- Missing, stale, partial, or low-quality sensor data MUST have defined handling.
- Permission state MUST be checked before sensor access.
- Time-sensitive multimodal inputs MUST define acceptable synchronization error.

## MUST NOT
- MUST NOT infer fresh sensor state from stale cached values without marking that condition.
- MUST NOT bypass operating-system permission controls.

## SHOULD
- Include sensor degradation and unavailable-sensor cases in validation.

## Exceptions
Require documented context, user impact, fallback, and approval.

## Verification
Inspect input contracts, permission checks, timestamp validation, sensor-quality tests, and degraded-mode behavior.