# Guardrail Testing Strategy

## Purpose
Build layered tests proving deterministic, semantic, integration, and end-to-end safety behavior.

## When to use
Use when creating/reviewing coverage and before major releases.

## Inputs
Requirements, architecture, threat model, taxonomy, controls, environments, risks.

## Context to inspect
Inspect boundaries, model dependencies, fixtures, sandboxes, CI, nondeterminism, regressions.

## Core knowledge
Combine deterministic and statistical tests: unit logic, integration boundaries, adversarial semantics, end-to-end outcomes.

## Procedure
1. Map requirements to layers.
2. Unit-test deterministic logic.
3. Contract-test integrations.
4. Test identity/tenant/retrieval/effects.
5. Run semantic evaluation.
6. Add injection/multi-turn suites.
7. Test failures/degradation.
8. Handle nondeterminism statistically.
9. Separate fast/deep gates.
10. Promote incidents to regressions.

## Decision points
Use mocks plus real-model evaluation; neither substitutes for the other.

## Common failure patterns
Unit-only tests, exact stochastic strings, no denied cases, mocked-away authorization, no failure tests, flaky gates.

## Verification
Critical tests fail when corresponding controls are safely disabled in test.

## Expected output
Test strategy and coverage map.

## Stop conditions
Stop release without critical executable verification.