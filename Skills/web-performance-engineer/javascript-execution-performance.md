# JavaScript Execution Performance

## Purpose
Reduce JavaScript CPU cost that blocks rendering, delays interactions, drains battery, or degrades responsiveness.

## When to use
Use when traces show high scripting time, long tasks, expensive framework work, repeated computation, or slow interaction handlers.

## Inputs
Browser traces, source maps, CPU profiles, bundle graph, interaction attribution, application code.

## Context to inspect
Identify affected routes, devices, event handlers, framework lifecycle work, task boundaries, dependency cost, and whether work is required before interaction.

## Core knowledge
Downloaded bytes and execution cost are related but not equivalent. Parse/compile, initialization, garbage collection, layout-triggering code, and repeated rendering all contribute. Yielding can improve responsiveness but does not remove unnecessary work.

## Procedure
1. Reproduce on representative hardware with a CPU profile.
2. Attribute scripting time to functions, modules, and interactions.
3. Separate required critical work from deferrable or unnecessary work.
4. Remove duplicate computations and redundant renders.
5. Reduce dependency and initialization cost.
6. Split long work into interruptible tasks where appropriate.
7. Move suitable CPU-heavy work off the main thread when transfer cost is acceptable.
8. Avoid layout reads/writes inside hot loops.
9. Re-profile after each material change.
10. Validate INP, task duration, memory, and functional correctness.

## Decision points
Use Web Workers for independent CPU work with manageable serialization. Prefer algorithmic reduction over scheduling. Memoize only when cache cost and invalidation complexity are justified.

## Common failure patterns
Chasing bundle size while runtime cost remains high; indiscriminate memoization; moving work to workers without measuring transfer overhead; yielding excessively; profiling minified code without source maps.

## Verification
Confirm reduced CPU time and long-task frequency on target devices, with unchanged behavior and no memory growth.

## Expected output
A profile-backed diagnosis, optimized hot paths, and before/after responsiveness evidence.

## Stop conditions
Escalate when performance requires framework migration, major algorithm redesign, or product behavior changes outside current authority.