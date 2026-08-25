# Actuator and Motor Control

## Purpose
Integrate and command motors, servos, hydraulic or pneumatic actuators with explicit ownership, limits, feedback, watchdogs, and safe failure behavior.

## When to use
Use when adding actuators, tuning command interfaces, resolving unstable motion, or reviewing actuator safety.

## Inputs
- Actuator and drive specifications
- Control mode requirements
- Encoder/current/torque feedback
- Mechanical limits
- Safety constraints
- Bus and firmware documentation

## Preconditions
Hardware limits, emergency-stop behavior, and command ownership must be known before enabling motion.

## Context to inspect
Inspect device drivers, command scaling, control modes, feedback rates, current/torque limits, watchdog configuration, homing logic, and fault-reset behavior.

## Core knowledge
Understand position, velocity, torque/current control, saturation, deadband, backlash, rate limits, watchdogs, drive faults, homing, thermal limits, and command arbitration.

## Procedure
1. Define one authoritative command owner per actuator.
2. Validate command and feedback units and sign conventions.
3. Configure hard and soft motion limits.
4. Establish feedback freshness requirements.
5. Select the lowest-level control mode appropriate to the application.
6. Implement command saturation and rate limiting.
7. Configure hardware and software watchdogs.
8. Define enable, disable, homing, fault, and reset state transitions.
9. Test motion at reduced power or speed first.
10. Validate stall, disconnect, overcurrent, encoder-fault, and stale-command behavior.
11. Record thermal and duty-cycle constraints.

## Decision points
Prefer drive-level loops when the drive can close them faster and more deterministically. Use host-level loops only when bandwidth, observability, and determinism are sufficient. Fail safe on stale commands unless a documented hold behavior is safer.

## Common failure patterns
- Competing command publishers
- Sign or gear-ratio mistakes
- Software limits without hardware protection
- Reusing stale feedback
- Aggressive reset loops that mask drive faults
- Enabling full torque before calibration

## Verification
Verify units, command authority, motion limits, feedback timing, watchdog trips, fault transitions, thermal behavior, and emergency-stop response using controlled tests.

## Expected output
A production-ready actuator interface with safe command semantics, feedback validation, limits, watchdogs, and fault handling.

## Stop conditions
Stop if emergency-stop behavior is unverified, mechanical limits are unknown, command polarity is ambiguous, or tests require unsafe physical operation without proper controls.