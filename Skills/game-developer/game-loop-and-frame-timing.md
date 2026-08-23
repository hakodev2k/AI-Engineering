# Game Loop and Frame Timing

## Purpose
Design and diagnose update loops so simulation, input, rendering, physics, and background work remain predictable across variable hardware and frame rates.

## When to use
Use for movement bugs, frame-rate-dependent behavior, fixed-step physics, pause/time-scale features, stutter, or custom runtime loops.

## Inputs
Engine loop semantics, target frame rate, timing APIs, physics settings, profiler traces, gameplay code, and platform constraints.

## Context to inspect
Inspect update phases, delta-time usage, fixed updates, render synchronization, timers, coroutines/tasks, pause logic, and work executed every frame.

## Core knowledge
Variable-step updates suit presentation and many gameplay tasks; fixed-step simulation improves stability and determinism but may require interpolation. Frame time is a budget, not just FPS. Long-tail frame spikes matter to perceived smoothness.

## Procedure
1. Document engine update order.
2. Classify work as simulation, physics, presentation, I/O, or background.
3. Identify code incorrectly tied to frame count.
4. Validate delta-time and fixed-step calculations.
5. Measure CPU/GPU frame times and spikes.
6. Move non-critical work off hot phases where safe.
7. Define catch-up limits for fixed simulation.
8. Validate pause, slow-motion, resume, and low-FPS behavior.
9. Test on representative slow and fast devices.

## Decision points
Choose fixed-step logic when numerical stability, replay, or deterministic simulation requires it. Prefer variable-step presentation where latency matters. Do not move engine-thread-affine work to background threads blindly.

## Common failure patterns
Multiplying already time-based values twice, unbounded fixed-step catch-up, expensive polling each frame, allocations in update loops, assuming 60 FPS, and mixing scaled with unscaled time incorrectly.

## Verification
Compare behavior at multiple frame rates, profile worst frames, test pause/time-scale transitions, and confirm physics and animation remain stable.

## Expected output
Frame-rate-independent behavior with documented timing assumptions and evidence that critical frame budgets are met.

## Stop conditions
Stop when engine timing semantics are unknown, profiler evidence is unavailable for a performance claim, or a proposed threading change violates engine API constraints.