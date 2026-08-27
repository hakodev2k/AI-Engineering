# Testing and Verification

## Purpose
Provide layered evidence that firmware behaves correctly on real targets.

## Scope
Unit, integration, hardware-in-loop, system, regression, and acceptance testing.

## MUST
- Critical requirements MUST map to verification evidence.
- Hardware-dependent behavior MUST be tested on representative hardware before release.
- Regression tests MUST cover corrected high-impact defects where deterministic reproduction is feasible.
- Tests MUST include failure paths, boundary conditions, reset behavior, and concurrency where relevant.
- Production compiler/linker configuration MUST receive release-level testing.

## MUST NOT
- Passing host-only tests MUST NOT be treated as proof of target timing or hardware correctness.
- Flaky critical tests MUST NOT be routinely retried until green without root-cause tracking.

## SHOULD
- Pure logic SHOULD be host-testable.
- Hardware-in-loop automation SHOULD cover critical peripherals and lifecycle operations.

## Exceptions
Unverified critical behavior requires explicit risk acceptance.

## Verification
Review requirement-to-test traceability, CI results, target test reports, coverage evidence, and unresolved flakes.