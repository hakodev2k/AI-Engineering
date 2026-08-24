# Debug Information Rules

## Purpose
Keep optimized programs debuggable without compromising generated-code correctness.

## Scope
Source mappings, variable locations, scopes, inline information, unwind and debug metadata.

## MUST
- Debug metadata MUST remain structurally valid after transformations.
- Source locations MUST not intentionally attribute generated behavior to unrelated source constructs.
- Variable-location tracking MUST represent unavailable values rather than inventing stale locations.
- Debug-info regressions MUST be tested at supported optimization levels.

## MUST NOT
- MUST NOT let malformed metadata crash release compilation.
- MUST NOT preserve metadata references to deleted or incompatible IR objects.
- MUST NOT claim exact variable availability when optimization has destroyed that information.

## SHOULD
- Transformations SHOULD preserve useful source provenance when inexpensive and sound.
- Debug quality SHOULD be measured with representative optimized programs.

## Exceptions
Known fidelity loss requires documentation, bounded scope, and regression protection.

## Verification
Use metadata verifiers, debugger integration tests, optimized-debug suites, unwind validation, and object inspection.