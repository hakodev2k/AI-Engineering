# Audio Gameplay Integration

## Purpose
Integrate sound with gameplay state reliably while controlling voice count, latency, spatial behavior, mixing, and runtime performance.

## When to use
Use for combat feedback, footsteps, ambience, music transitions, spatial audio, voice management, or audio performance defects.

## Inputs
Audio assets/events, gameplay triggers, mixer/bus design, spatial requirements, platform limits, memory budget, and localization needs.

## Context to inspect
Inspect event triggers, pooling, simultaneous voices, streaming/decompression settings, listener ownership, mixer snapshots, spatial attenuation, and lifecycle cleanup.

## Core knowledge
Audio is both feedback and a runtime resource. Event-driven integration should avoid duplicate triggers and dangling emitters. Compression, streaming, preload, and voice virtualization trade memory, CPU, I/O, and latency.

## Procedure
1. Define semantic audio events from gameplay.
2. Separate gameplay events from concrete clips where possible.
3. Establish spatial and non-spatial routing.
4. Define priority and concurrency limits.
5. Choose preload, compressed-in-memory, or streaming based on duration and latency.
6. Handle interrupted/destroyed emitters safely.
7. Coordinate music/state transitions explicitly.
8. Profile voice count, CPU, memory, and I/O.
9. Test rapid repeated events and scene transitions.

## Decision points
Preload short latency-critical effects; stream long music/ambience when storage bandwidth supports it. Virtualize low-priority distant voices instead of playing unlimited sources.

## Common failure patterns
One audio source per transient object forever, duplicate events from prediction/reconciliation, no concurrency limits, large uncompressed music in memory, and audio state tied to visual object lifetime incorrectly.

## Verification
Stress high-action scenes, inspect voice/memory/CPU metrics, test interruption and scene unload, and validate spatial/mixer behavior on target hardware.

## Expected output
Reliable gameplay audio integration with bounded resource use and explicit event ownership.

## Stop conditions
Stop when middleware/platform audio constraints or licensing/localization requirements are unresolved.