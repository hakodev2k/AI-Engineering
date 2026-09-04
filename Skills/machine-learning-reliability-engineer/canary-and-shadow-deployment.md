# Canary and Shadow Deployment

## Purpose
Release new models safely with controlled exposure and measurable rollback criteria.

## When to use
Use for model upgrades, feature-pipeline changes, or serving-runtime changes with production risk.

## Inputs
Current and candidate models, routing capability, telemetry, acceptance metrics, rollback mechanism.

## Context to inspect
Traffic segmentation, model compatibility, feature availability, latency budgets, downstream side effects, and version observability.

## Core knowledge
Shadow traffic observes behavior without affecting decisions; canaries expose a small real cohort. Both require comparable telemetry and explicit exit criteria.

## Procedure
1. Define candidate risks and success metrics.
2. Validate offline and pre-production checks.
3. Run shadow traffic when side-effect-free comparison is possible.
4. Compare predictions, latency, errors, and resource use.
5. Start a small canary with representative traffic.
6. Increase exposure only when guardrails remain healthy.
7. Stop automatically on severe regression.
8. Preserve rollback to the prior known-good version.

## Decision points
Use shadowing first for high-risk changes; canary directly when online outcome measurement is essential and rollback is reliable.

## Common failure patterns
Biased canary cohorts, missing version tags, comparing incomplete labels, or irreversible downstream side effects.

## Verification
Prove routing, telemetry, threshold checks, and rollback in a controlled test before broad rollout.

## Expected output
A staged release plan with guardrails, exposure steps, and rollback criteria.

## Stop conditions
Stop rollout on SLO breach, quality regression, inconsistent telemetry, or unavailable rollback.