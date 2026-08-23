# Crash, Hang, and Production Debugging

## Purpose
Investigate production iOS crashes, hangs, watchdog terminations, and hard-to-reproduce defects using symbolicated evidence and controlled hypotheses.

## When to use
Use for crash reports, MetricKit diagnostics, user-reported freezes, watchdog exits, or regressions seen only in production.

## Inputs
Crash/hang reports, symbols/dSYMs, app/OS/device versions, breadcrumbs, reproduction clues, release diff.

## Context to inspect
Exception/signal, crashed thread, all thread stacks, binary images, memory pressure, main-thread blocking, recent releases, feature flags.

## Core knowledge
A stack frame near the crash is not necessarily the root cause. Symbolication and exact build identity are prerequisites. Hangs often require examining lock/wait relationships across threads.

## Procedure
1. Confirm report belongs to exact build and is symbolicated.
2. Cluster incidents by signature and environment.
3. Classify crash, watchdog, OOM/jetsam, or hang.
4. Trace execution/state prerequisites from evidence.
5. Compare recent code/config changes.
6. Form falsifiable hypotheses.
7. Reproduce under matching conditions when possible.
8. Fix the underlying invariant/lifecycle/threading issue.
9. Add regression coverage and telemetry.
10. Monitor post-release recurrence.

## Decision points
Prioritize by affected users, severity, trend, and data-loss risk—not raw count alone.

## Common failure patterns
Unsymbolicated guessing, fixing only the top frame, swallowing exceptions, adding delays, and ignoring device/OS concentration.

## Verification
Reproduction no longer fails, regression tests pass, and production signature rate declines after rollout.

## Expected output
Evidence-backed root cause, fix, verification, and residual uncertainty.

## Stop conditions
Stop when symbols/build artifacts are unavailable or evidence suggests an OS/vendor defect requiring escalation.