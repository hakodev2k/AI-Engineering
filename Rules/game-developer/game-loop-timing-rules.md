# Game Loop and Timing Rules

## Purpose
Protect simulation correctness, responsiveness, and determinism across variable hardware and frame rates.

## Scope
Main loops, fixed/variable updates, clocks, pause, time scaling, and frame pacing.

## MUST
- Simulation code MUST use an explicit time model and appropriate delta or fixed timestep.
- Physics or deterministic simulation MUST NOT depend on render frame rate.
- Large time gaps after suspension or stalls MUST be bounded or handled explicitly.
- Timing-sensitive changes MUST be tested at representative low, target, and high frame rates.

## MUST NOT
- MUST NOT use wall-clock time where monotonic elapsed time is required.
- MUST NOT hide simulation instability by merely clamping visible output.

## SHOULD
- Rendering SHOULD interpolate fixed-step state when smooth presentation requires it.
- Time ownership SHOULD be centralized enough to support pause, replay, tests, and slow motion.

## Exceptions
Alternative timing models require documented platform constraints, failure modes, and validation evidence.

## Verification
Use automated simulation tests, frame-time captures, suspension/resume tests, and code review of clock sources and update ordering.