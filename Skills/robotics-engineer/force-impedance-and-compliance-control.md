# Force, Impedance, and Compliance Control

## Purpose
Control physical interaction with people, tools, and environments while limiting contact forces and maintaining stable compliant behavior.

## When to use
Use for manipulation, assembly, contact-rich tasks, force-limited motion, cobots, or when rigid position control causes impacts or instability.

## Inputs
Force/torque sensing, robot dynamics, contact geometry, stiffness/damping targets, actuator limits, safety thresholds, task tolerances.

## Preconditions
Force sensing and frame transforms are calibrated; emergency limits are active.

## Context to inspect
Control loop rate, sensor filtering, gravity/tool compensation, collision thresholds, environment stiffness, actuator saturation, mechanical compliance.

## Core knowledge
Force, impedance, and admittance control shape the relationship between motion and interaction force. Stability depends on delay, sensor noise, environment stiffness, and inner-loop behavior.

## Procedure
1. Define desired interaction behavior and maximum safe forces.
2. Validate sensor zeroing, bias, gravity, and tool compensation.
3. Select force, impedance, or admittance architecture based on actuator/control access.
4. Choose stiffness and damping conservatively.
5. Add force/velocity/position saturation and contact detection.
6. Validate free-space behavior before contact.
7. Introduce contact with compliant fixtures and low speed.
8. Test varying stiffness, friction, and approach errors.
9. Measure force peaks, settling, tracking, and passivity/stability indicators.
10. Define fallback on sensor loss, saturation, or unexpected contact.

## Decision points
Use impedance when commanding force-like actuator behavior is available; use admittance when outer-loop motion commands must react to measured force.

## Common failure patterns
Uncompensated tool gravity, excessive stiffness, delayed force filtering, frame errors, impact before controller engagement, and no behavior for sensor saturation.

## Verification
Demonstrate bounded contact force, stable interaction across expected environment stiffness, and safe fallback after sensor/communication faults.

## Expected output
Interaction-control parameters, thresholds, validation evidence, and operating limits.

## Stop conditions
Stop if force signals are unreliable, contact instability occurs, or safe force bounds cannot be guaranteed.