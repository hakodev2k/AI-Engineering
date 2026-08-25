# Safe Model Rollout and Rollback

## Purpose
Release model changes progressively, measure real-world impact and recover quickly from regressions.

## When to use
Use for new models, retrained versions, threshold changes or material preprocessing changes.

## Inputs
Candidate/incumbent versions, acceptance metrics, traffic controls, rollback artifact and monitoring.

## Context to inspect
Serving topology, compatibility, experiment assignment, downstream side effects and incident procedures.

## Core knowledge
Offline superiority is insufficient. Shadow, canary and controlled experiments expose integration and distribution effects while limiting blast radius.

## Procedure
1. Verify candidate provenance and offline gates.
2. Confirm backward/forward schema compatibility.
3. Validate rollback artifact and command/path.
4. Shadow traffic when outputs can be compared safely without affecting users.
5. Start canary at limited exposure.
6. Compare system, ML and business guardrails against incumbent.
7. Increase exposure only after stable observation windows.
8. Separate model effects from concurrent product changes.
9. Roll back automatically or manually on predeclared critical breaches.
10. Record final rollout evidence.

## Decision points
Use shadowing for integration validation, canaries for blast-radius control, and randomized A/B tests for causal product impact where ethical and feasible.

## Common failure patterns
Big-bang deployment, no rollback rehearsal, insufficient observation time, changing multiple variables simultaneously and comparing non-equivalent traffic.

## Verification
Exercise rollback, validate traffic allocation and confirm monitoring distinguishes versions and cohorts.

## Expected output
Controlled rollout with evidence-backed promotion or rollback decision.

## Stop conditions
Stop rollout immediately on safety, severe quality, compatibility or SLO guardrail breach.