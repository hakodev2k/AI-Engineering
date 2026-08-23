# Game Testing Strategy

## Purpose
Create layered automated and manual testing that protects gameplay rules, integrations, content, performance, and player-critical journeys without trying to automate everything.

## When to use
Use when defining release quality, adding complex systems, reducing regressions, stabilizing CI, or improving testability.

## Inputs
Game architecture, risk areas, supported platforms, release cadence, existing tests, content pipeline, telemetry, and defect history.

## Context to inspect
Inspect pure gameplay logic, engine integration seams, deterministic simulation opportunities, scene tests, content validation, build automation, and flaky tests.

## Core knowledge
Games contain highly visual, temporal, and emergent behavior. Unit tests are strongest for deterministic rules; integration tests for engine boundaries; automated play tests for stable critical journeys; human testing remains important for feel and visual quality.

## Procedure
1. Rank failure risks by impact and frequency.
2. Extract deterministic rules behind testable interfaces.
3. Add unit tests for invariants and calculations.
4. Add integration tests for persistence, physics contracts, services, and engine lifecycle where valuable.
5. Add content/schema validators.
6. Automate a small set of stable player-critical flows.
7. Add performance budgets and smoke benchmarks.
8. Quarantine and investigate flaky tests rather than normalizing retries.
9. Run appropriate suites in CI and target builds.
10. Review escaped defects to improve coverage.

## Decision points
Automate when behavior is stable, repeatable, and costly to verify manually. Prefer validators over full play tests for static content rules. Keep subjective game-feel evaluation human-led.

## Common failure patterns
Only end-to-end tests, asserting frame-perfect visuals unnecessarily, tests tied to scene object names, uncontrolled randomness, retrying flakes indefinitely, and no target-platform validation.

## Verification
Introduce controlled failures to confirm tests detect them, track flake rate, measure suite duration, and ensure critical release risks have explicit coverage.

## Expected output
A risk-based test portfolio with reliable automation and clear manual validation boundaries.

## Stop conditions
Stop when requirements are too unstable for durable assertions or test infrastructure cannot reproduce the target runtime accurately.