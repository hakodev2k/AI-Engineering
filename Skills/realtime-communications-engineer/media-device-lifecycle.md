# Media Device Lifecycle

## Purpose
Manage cameras, microphones, speakers, permissions, switching, interruption, and teardown without leaks or broken sessions.

## When to use
Use for capture bugs, device switching, permission flows, mobile interruptions, mute semantics, or resource leaks.

## Inputs
Platform APIs, device events, permission state, track/transceiver lifecycle, UI requirements, and failing logs.

## Core knowledge
Media device state spans OS permissions, physical availability, capture tracks, application mute, sender state, routing, and session negotiation. These states should not be conflated.

## Procedure
1. Model permission, device, track, sender, and UI state separately.
2. Inspect current device enumeration and selection behavior.
3. Define initial acquisition and denied-permission paths.
4. Define mute versus track stop semantics.
5. Implement device switching without unnecessary renegotiation when supported.
6. Handle unplug, route change, phone interruption, backgrounding, and resume.
7. Release unused devices deterministically.
8. Avoid exposing sensitive device labels before permission rules allow it.
9. Test repeated join/leave and switch cycles.

## Decision points
Disable a track when fast resume is required and resource/privacy policy permits; stop capture when hardware release or privacy is more important. Preserve explicit user choice unless the selected device disappears.

## Common failure patterns
Mute UI not matching transmitted media; leaked capture tracks; switching causes duplicate senders; permission denial loops; stale device IDs; camera left active after session exit.

## Verification
Verify OS indicators, transmitted media state, device release, repeated switching, interruptions, permission changes, and no accumulating resources.

## Expected output
A deterministic device-state implementation and lifecycle regression suite.

## Stop conditions
Escalate when platform permission policy or hardware behavior prevents the required product semantics.