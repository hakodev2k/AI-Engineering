# Coordinate Frame Rules
## Purpose
Prevent spatial errors caused by ambiguous frames, units, transforms, or timestamps.
## Scope
Kinematics, perception, localization, planning, calibration, and telemetry.
## MUST
- Give every spatial quantity an unambiguous frame, convention, unit, and timestamp semantics.
- Validate transform direction, handedness, axis conventions, and composition order at subsystem boundaries.
- Version and control calibration transforms used in production.
- Reject or explicitly handle transforms that are stale or unavailable beyond defined tolerances.
## MUST NOT
- Mix degrees and radians, metric and nonmetric units, or frame conventions implicitly.
- Encode critical transforms as unexplained constants.
## SHOULD
- Use typed or structurally explicit representations that make frame misuse difficult.
## Exceptions
Any intentionally approximate transform requires documented error bounds and impact analysis.
## Verification
Use transform-tree inspection, calibration fixtures, invariant tests, visualization, timestamp tests, and known-pose regression cases.