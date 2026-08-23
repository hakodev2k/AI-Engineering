# Input and Player Control

## Purpose
Build responsive, remappable, device-independent player input while keeping physical input separate from gameplay intent.

## When to use
Use for keyboard/mouse, controller, touch, accessibility input, rebinding, local multiplayer, or input-latency problems.

## Inputs
Supported devices, control scheme, accessibility requirements, gameplay actions, engine input APIs, UI behavior, and platform certification constraints.

## Context to inspect
Inspect input polling/events, action maps, focus handling, dead zones, sensitivity, rebinding persistence, UI navigation, and device switching.

## Core knowledge
Translate device signals into semantic actions before gameplay consumes them. Account for analog ranges, dead zones, buffering, chords, hold/tap distinctions, and conflicting contexts. Responsiveness is part of game feel.

## Procedure
1. Define semantic gameplay actions.
2. Map each supported device to actions.
3. Define context layers such as gameplay, menu, vehicle, or spectator.
4. Normalize analog values and dead zones.
5. Add rebinding and conflict detection where required.
6. Handle device connect/disconnect and focus changes.
7. Define buffering for timing-sensitive actions.
8. Measure end-to-end input response for critical mechanics.
9. Test accessibility and alternate control schemes.

## Decision points
Use buffered input for actions with narrow timing windows; immediate state for continuous movement. Resolve simultaneous bindings based on explicit context rather than arbitrary event order.

## Common failure patterns
Hard-coded keys, gameplay reading devices directly, missing controller disconnect handling, inaccessible hold requirements, inconsistent UI/gameplay mappings, and frame-dependent input sampling.

## Verification
Test all supported devices, rebinding persistence, context transitions, disconnect/reconnect, focus loss, low frame rate, and latency-sensitive actions.

## Expected output
A semantic, responsive, configurable input layer with predictable context handling.

## Stop conditions
Stop when required platform input behavior or accessibility requirements are undefined, or hardware-specific behavior cannot be tested.