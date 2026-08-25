# Physics Simulation Rules

## Purpose
Prevent unstable, frame-dependent, and non-reproducible physical behavior.

## Scope
Rigid bodies, collision, triggers, character movement, queries, and physics configuration.

## MUST
- Physics-affecting operations MUST execute in the engine-defined simulation phase.
- Collision layers and masks MUST express intentional interaction policy.
- High-speed or precision-critical interactions MUST use appropriate continuous detection or equivalent mitigation.
- Physics tuning changes MUST be validated against representative gameplay scenarios.

## MUST NOT
- MUST NOT directly teleport dynamic bodies as a routine substitute for forces or kinematic control without understanding solver consequences.
- MUST NOT rely on undefined collision callback ordering.

## SHOULD
- Character locomotion SHOULD separate player intent from physical resolution.
- Physics queries SHOULD be bounded and profiled in hot paths.

## Exceptions
Intentional nonphysical mechanics require explicit ownership and regression tests.

## Verification
Use fixed-step tests, collision matrices, replay scenarios, solver diagnostics, and profiler captures.