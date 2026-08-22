# Debugging and Root Cause Analysis

## Purpose
Diagnose Angular defects systematically and fix causes rather than symptoms.

## When to use
Use for reproducible bugs, intermittent UI failures, state inconsistencies, browser errors, and regressions.

## Inputs
Bug report, reproduction steps, code, console/network logs, traces, test results, and recent changes.

## Context to inspect
Inspect browser console, network requests, state transitions, router events, change detection, source maps, dependencies, and backend responses.

## Core knowledge
Separate observation from hypothesis. Reduce the failing path, compare working and failing cases, and gather evidence at boundaries before changing code.

## Procedure
1. Define expected versus observed behavior.
2. Reproduce reliably and record conditions.
3. Narrow the failure to UI, state, routing, network, browser, or backend boundary.
4. Inspect relevant logs and state transitions.
5. Form one falsifiable hypothesis at a time.
6. Create the smallest experiment that tests it.
7. Fix the root cause with minimal blast radius.
8. Add regression coverage and verify adjacent behavior.

## Decision points
Instrument before refactoring when evidence is weak. Escalate backend or infrastructure causes with captured evidence rather than assumptions.

## Common failure patterns
Random edits, blaming timing, adding delays, swallowing exceptions, fixing symptoms, and changing multiple variables simultaneously.

## Verification
Original reproduction no longer fails, regression test proves the defect, and logs show expected boundary behavior.

## Expected output
A verified root-cause fix with regression evidence.

## Stop conditions
Stop when reproduction requires unavailable production data or destructive actions; escalate with collected evidence.