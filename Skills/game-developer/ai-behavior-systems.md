# AI Behavior Systems

## Purpose
Design understandable and scalable non-player behavior that meets gameplay goals without creating brittle decision logic.

## When to use
Use for enemies, companions, NPC routines, tactical decisions, perception, navigation decisions, or AI debugging.

## Inputs
Desired behaviors, perception model, navigation capabilities, combat rules, performance budget, difficulty goals, and debugging needs.

## Context to inspect
Inspect existing state machines, behavior trees, utility scoring, blackboards, navigation, sensory queries, update frequency, and authority in multiplayer.

## Core knowledge
Game AI optimizes player experience rather than theoretical intelligence. State machines, behavior trees, utility systems, planners, and hybrids have different authoring and runtime trade-offs. Observability is essential because emergent behavior is hard to infer from code alone.

## Procedure
1. Define player-facing behavior goals.
2. Identify decisions, actions, perceptions, and memory.
3. Choose the simplest decision model that supports required complexity.
4. Separate sensing from decision and action execution.
5. Define interruption and priority rules.
6. Budget expensive perception/navigation work.
7. Add debug visualization and decision traces.
8. Test adversarial and degenerate scenarios.
9. Tune using gameplay evidence, not only code correctness.

## Decision points
Use state machines for compact mode-driven behavior; behavior trees for hierarchical authored flows; utility scoring for competing contextual choices; planners only when dynamic action composition provides clear value.

## Common failure patterns
Per-frame world scans, invisible decision reasons, giant behavior trees, contradictory priorities, AI cheating unintentionally, and tuning constants scattered through code.

## Verification
Replay representative encounters, inspect decision traces, stress many agents, validate navigation failures, and test difficulty variants.

## Expected output
Debuggable AI behavior with explicit decision structure, bounded runtime cost, and tunable parameters.

## Stop conditions
Stop when gameplay intent is undefined, required navigation/perception data is unavailable, or networking authority makes local AI decisions invalid.