# Animation and Gameplay Integration

## Purpose
Integrate animation with gameplay without allowing visual state, timing callbacks, and simulation authority to become fragile or contradictory.

## When to use
Use for locomotion, attacks, hit reactions, root motion, animation events, state machines, IK, or synchronization bugs.

## Inputs
Animation assets, gameplay timing requirements, animator graph, movement model, networking model, and frame timing.

## Context to inspect
Inspect animation parameters, transitions, root motion, event callbacks, blend trees, montage/state layers, and gameplay code waiting on animations.

## Core knowledge
Animation and gameplay have different responsibilities. Visual transitions should usually represent authoritative gameplay state, while selected animation timing can intentionally drive mechanics when explicitly designed. Root motion trades direct physical control for authored motion fidelity.

## Procedure
1. Identify authoritative gameplay state.
2. Define data passed from gameplay to animation.
3. Identify animation events that genuinely need gameplay effects.
4. Make event handling idempotent where interruption is possible.
5. Decide root-motion ownership per mechanic.
6. Handle cancellation, blending, and interrupted clips.
7. Add fallback behavior for missing events/assets.
8. Profile complex rigs and animation graphs.
9. Test low frame rate and network correction cases.

## Decision points
Use gameplay-driven timing for competitive or deterministic mechanics; animation-driven timing where authored motion is the design source of truth. Use root motion selectively and define networking consequences.

## Common failure patterns
Animation state as hidden gameplay authority, essential logic depending on one-shot events, transition spaghetti, duplicate damage events, and unhandled interrupted animations.

## Verification
Test every interruption path, frame-rate extremes, asset variants, root-motion collisions, and network correction if applicable.

## Expected output
A clear contract between gameplay and animation with resilient timing and interruption behavior.

## Stop conditions
Stop when authority between animation and gameplay is undefined or required animation metadata/assets are incomplete.