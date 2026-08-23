# Frontend Debugging

## Purpose
Investigate frontend defects systematically using reproduction, browser developer tools, state/network evidence, source maps, and hypothesis-driven isolation.

## When to use
Use for rendering bugs, stale state, failed requests, event issues, browser-specific failures, race conditions, and regressions.

## Inputs
Bug report, reproduction steps, browser/device, logs, screenshots/video, network evidence, source code, and recent changes.

## Context to inspect
Console, network requests, DOM/accessibility tree, computed styles, application state, performance trace, storage, source maps, and deployment version.

## Core knowledge
Debug from evidence rather than changing code speculatively. Separate symptom, trigger, faulty state, and root cause. Browser timing and network races can make intermittent failures disappear under breakpoints.

## Procedure
1. Restate expected versus observed behavior.
2. Reproduce on the reported version and environment.
3. Minimize the reproduction while preserving failure.
4. Capture console, network, state, DOM, and timing evidence.
5. Identify the first incorrect observable state.
6. Form one falsifiable hypothesis.
7. Instrument or isolate the relevant boundary.
8. Confirm root cause before implementing the fix.
9. Add a regression test at the lowest effective layer.
10. Verify the original reproduction and adjacent behavior.

## Decision points
Use source-level debugging for deterministic logic, network inspection for integration failures, performance tooling for timing/jank, and production telemetry when local reproduction diverges from real users.

## Common failure patterns
Shotgun edits, clearing caches as the final fix, assuming console errors are causal, debugging the wrong deployed version, breakpoint-induced race masking, and fixing symptoms without regression coverage.

## Verification
The original failure is reproducible before the fix, the causal change removes it, regression tests fail on old behavior, and affected browsers/workflows are retested.

## Expected output
A root-cause explanation, bounded fix, regression evidence, and any remaining risk.

## Stop conditions
Stop when the deployed version cannot be identified, evidence requires unauthorized production data, or reproduction depends on unavailable external systems.