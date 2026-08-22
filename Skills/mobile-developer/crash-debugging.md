# Crash Debugging

## Purpose
Turn mobile crash evidence into reproducible root causes and verified fixes.

## When to use
Production crashes, fatal exceptions, native crashes, watchdog/ANR-like failures.

## Inputs
Symbolicated stack traces, breadcrumbs, app/device/OS versions, logs, release metadata.

## Context to inspect
Crash grouping, affected versions, recent changes, lifecycle state, threads, memory pressure, native dependencies.

## Core knowledge
Stack traces identify failure location, not always root cause. Production debugging requires version-correct symbols and correlation with state and release changes.

## Procedure
1. Validate symbolication and exact build version.
2. Quantify affected users/sessions and severity.
3. Segment by OS/device/feature/release.
4. Reconstruct preceding events.
5. Inspect relevant code and recent diffs.
6. Reproduce with matching lifecycle/data conditions.
7. Form and test a root-cause hypothesis.
8. Implement minimal safe fix plus regression test.
9. Monitor crash-free metrics after rollout.

## Decision points
Hotfix when impact and confidence justify release risk; otherwise stage rollout with safeguards.

## Common failure patterns
Fixing top frame only, missing symbols, swallowing exceptions, declaring success before production evidence.

## Verification
Regression test plus post-release crash-rate reduction.

## Expected output
Root cause, fix, evidence, monitoring plan.

## Stop conditions
Escalate suspected OS/vendor defects after a minimal reproducible case.