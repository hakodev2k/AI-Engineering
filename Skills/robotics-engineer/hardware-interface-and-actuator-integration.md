# Hardware Interface and Actuator Integration

## Purpose
Integrate motors, drives, encoders, brakes, and low-level controllers with correct units, limits, timing, fault handling, and safe command semantics.

## When to use
Use when adding or replacing actuators, motor drives, joint controllers, or diagnosing unexpected motion, saturation, or hardware faults.

## Inputs
Electrical/mechanical specifications, drive manuals, gear ratios, encoder resolution, limits, communication protocol, control modes, safety constraints.

## Preconditions
Power and motion testing can be performed safely with appropriate guards and emergency stop.

## Context to inspect
Firmware configuration, command scaling, current/torque limits, homing, zero offsets, fault registers, watchdogs, bus timing, thermal limits.

## Core knowledge
Command semantics must match the physical plant: torque/current, velocity, and position modes have different stability and safety implications. Gear ratio, encoder scaling, sign, and unit errors can produce dangerous motion.

## Procedure
1. Validate wiring, power ratings, and communication identity.
2. Confirm command/feedback units and sign conventions.
3. Verify encoder resolution, gear ratio, and zero reference.
4. Configure current, velocity, position, temperature, and travel limits.
5. Define watchdog and communication-loss behavior.
6. Test enable/disable and brake sequencing without load.
7. Command small bounded motions and compare expected feedback.
8. Measure latency, saturation, thermal behavior, and fault reporting.
9. Validate homing and restart behavior.
10. Document safe commissioning and recovery procedures.

## Decision points
Use lower-level torque/current control only when the software stack can meet timing and safety requirements. Prefer drive-local loops when they provide better deterministic protection.

## Common failure patterns
Wrong gear ratio, encoder wrap mistakes, unsafe default enable, ignored drive faults, mismatched control mode, missing watchdogs, and commanding beyond thermal/current capability.

## Verification
Measure commanded vs actual motion/torque, verify every configured limit and watchdog, inject communication loss, and validate fault reset sequencing.

## Expected output
Validated hardware interface, scaling/limit configuration, commissioning evidence, and fault-handling procedure.

## Stop conditions
Stop on unexpected motion, inconsistent feedback, overheating, repeated drive faults, or inability to guarantee bounded commands.