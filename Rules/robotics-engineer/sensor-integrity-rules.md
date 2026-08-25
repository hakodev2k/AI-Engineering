# Sensor Integrity Rules
## Purpose
Ensure decisions are based on trustworthy, bounded sensor information.
## Scope
Encoders, IMUs, cameras, lidar, force sensors, proximity sensors, and derived measurements.
## MUST
- Define units, frames, ranges, resolution, update rates, uncertainty, validity, and stale-data thresholds.
- Detect missing, implausible, saturated, stale, and inconsistent measurements when they can affect behavior.
- Calibrate sensors with traceable procedures and preserve calibration metadata.
- Define degraded behavior for loss of required sensing.
## MUST NOT
- Treat a received sample as valid merely because transport succeeded.
- Silently substitute default measurements for failed safety- or control-relevant sensors.
## SHOULD
- Cross-check independent signals for high-consequence decisions.
## Exceptions
Use of unvalidated sensing requires bounded experimental conditions, explicit risk controls, and documented evidence.
## Verification
Review calibration records, plausibility checks, timestamp handling, fault injection, telemetry, and degraded-mode tests.