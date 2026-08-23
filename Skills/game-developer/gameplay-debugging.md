# Gameplay Debugging

## Purpose
Investigate complex gameplay defects systematically using reproducible evidence, state inspection, instrumentation, and hypothesis-driven experiments.

## When to use
Use for intermittent mechanics, invalid states, timing bugs, AI failures, collision anomalies, save corruption, or bugs that cross multiple systems.

## Inputs
Bug report, build/version, reproduction steps, logs, captures, save data, telemetry, code, and environment details.

## Context to inspect
Inspect recent changes, state transitions, timing, random seeds, event order, object lifecycle, platform differences, and network conditions.

## Core knowledge
Gameplay bugs often emerge from state plus timing rather than a single bad line. Preserve evidence before changing code. Deterministic reproduction, state snapshots, event traces, and binary-searching changes reduce investigation time.

## Procedure
1. Restate expected versus observed behavior.
2. Capture exact build, content version, platform, and state.
3. Reproduce with the smallest stable scenario possible.
4. Instrument relevant state transitions and events.
5. Form a falsifiable hypothesis.
6. Change one variable or add one observation at a time.
7. Identify the earliest point where state diverges.
8. Fix the root cause rather than downstream symptoms.
9. Add regression coverage or diagnostic guards.
10. Re-test adjacent gameplay paths.

## Decision points
Use debugger breakpoints for stable local defects; structured traces for timing/network issues; replay/state capture for intermittent behavior; content validation for data-driven failures.

## Common failure patterns
Editing before reproducing, adding arbitrary delays, swallowing exceptions, fixing visible symptoms, relying on screenshots without state, and deleting diagnostics before verification.

## Verification
Reproduce before fix, prove failure disappears after fix, run regression scenarios, and confirm instrumentation does not hide timing behavior.

## Expected output
A documented root cause, minimal corrective change, and durable regression protection.

## Stop conditions
Stop when the exact build/content cannot be identified, evidence points to inaccessible platform/runtime code, or reproduction would risk production data.