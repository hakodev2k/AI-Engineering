# Motion Control Rules
## Purpose
Ensure commanded motion is stable, bounded, predictable, and appropriate to the mechanism.
## Scope
Position, velocity, torque, trajectory, and servo control.
## MUST
- Define control rates, limits, saturation behavior, and stability assumptions explicitly.
- Enforce position, velocity, acceleration, jerk, torque, and workspace limits where applicable.
- Validate controllers across expected payload, friction, voltage, temperature, and timing variation.
- Make loss of feedback or control-loop deadline violations transition to a defined safe behavior.
## MUST NOT
- Tune production controllers solely by subjective observation.
- Allow integrator windup or actuator saturation to create uncontrolled recovery motion.
- Change gains or limits in production without controlled configuration management.
## SHOULD
- Use measured frequency/time-domain evidence and representative load cases for tuning.
## Exceptions
Nonstandard control strategies require documented assumptions, stability evidence, bounded failure behavior, and review.
## Verification
Inspect controller configuration, logs, saturation events, timing traces, step/trajectory tests, and fault-response tests.