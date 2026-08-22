# Accessibility Lifecycle Hooks

## Intake hook
Validate scope, critical journeys, target platforms, owner, deadline, severity context and expected evidence. If missing, mark `blocked-intake` rather than guessing.

## Pre-implementation hook
For medium/high-risk UI work, require semantic intent, keyboard model, focus behavior, error/status communication, responsive/zoom behavior, and test plan before coding.

## Pre-review hook
Run deterministic checks when available; reject empty evidence, inaccessible-name regressions, obvious focus traps and unresolved critical-path barriers.

## Pre-release hook
Require completed manual coverage for agreed high-risk journeys, all critical/high findings dispositioned, and any residual-risk approval attached.

## Post-release hook
Sample production telemetry/user feedback for accessibility regressions; reopen verified regressions and feed root-cause lessons into patterns/checklists.

Hooks must be idempotent where possible, must not mutate production, and must fail closed only for explicitly defined release-blocking conditions.