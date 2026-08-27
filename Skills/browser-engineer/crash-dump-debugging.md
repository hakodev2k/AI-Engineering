# Crash Dump Debugging

## Purpose
Turn browser crashes into reproducible root causes across processes, threads, asynchronous lifetimes, and platform-specific code.

## When to use
Use for production crashes, assertions, access violations, stack corruption, or crash-rate regressions.

## Inputs
Symbolized dump, stack, process type, build/version, crash keys, reproduction data, recent changes.

## Context to inspect
Faulting thread, all-thread stacks, exception code, registers where available, object lifetime, task origin, process role.

## Core knowledge
The crashing instruction may be downstream of corruption or lifetime misuse. Browser crashes often depend on navigation teardown, process shutdown, callbacks, or rare scheduling.

## Procedure
1. Confirm symbols and exact build.
2. Classify crash signature and affected process.
3. Inspect faulting and related thread stacks.
4. Reconstruct object ownership and asynchronous sequence.
5. Correlate crash metadata with feature/platform cohorts.
6. Search recent changes and similar signatures.
7. Build a deterministic or stress reproduction.
8. Fix the root invariant violation.
9. Add regression coverage and monitor signature disappearance.

## Decision points
Prefer invariant/lifetime fixes over null guards unless null is valid state. Revert a recent high-impact regression when safe diagnosis cannot complete quickly.

## Common failure patterns
Fixing top frame only; unsymbolized analysis; ignoring non-faulting threads; adding defensive checks that hide corruption; no post-release monitoring.

## Verification
Regression test passes, stress reproduction is clean, sanitizer builds show no related fault, and crash telemetry declines after rollout.

## Expected output
A root-cause report and verified corrective change.

## Stop conditions
Stop when dumps lack sufficient data, symbols are unavailable, or suspected security-sensitive corruption requires security escalation.