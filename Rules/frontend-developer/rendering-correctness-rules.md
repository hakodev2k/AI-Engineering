# Rendering Correctness Rules
## Purpose
Prevent inconsistent, stale, or non-deterministic user interfaces.
## Scope
Rendering, reconciliation, list identity, conditional UI, and hydration.
## MUST
- Render output MUST be a deterministic function of declared inputs and owned state except for explicit effects.
- Collection identity MUST use stable domain identity when reorder, insertion, or deletion is possible.
- Client/server rendering boundaries MUST account for hydration consistency when applicable.
- Loading, empty, error, partial, and success states MUST be deliberately represented for critical views.
## MUST NOT
- Render logic MUST NOT mutate application state.
- Random, time-dependent, or environment-dependent values MUST NOT create uncontrolled hydration differences.
## SHOULD
- Keep render paths side-effect free and easy to reason about.
## Exceptions
Framework-required escape hatches require documented rationale and tests.
## Verification
Use deterministic tests, hydration warnings, UI inspection, and state-transition coverage.