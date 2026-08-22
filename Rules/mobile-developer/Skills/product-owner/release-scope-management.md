# Release Scope Management

## Purpose
Shape release scope to maximize outcome, learning, and reliability while respecting deadlines and delivery uncertainty.

## When to use
Use for release planning, fixed-date commitments, scope pressure, late discoveries, and readiness decisions.

## Inputs
Product goal, candidate backlog, dependencies, delivery evidence, quality status, release constraints, and operational readiness.

## Context to inspect
Inspect completed versus verified behavior, unresolved defects, feature dependencies, migration needs, support readiness, and rollback options.

## Core knowledge
Scope, time, quality, and risk interact. Senior Product Owners protect critical quality and outcome while treating optional scope as adjustable. Completion is not equivalent to releasability.

## Procedure
1. Restate the release outcome and fixed constraints.
2. Classify scope as essential, valuable, or optional.
3. Identify dependencies and all-or-nothing bundles.
4. Review verification and operational readiness.
5. Remove low-value scope when risk increases.
6. Consider feature flags or phased exposure where appropriate.
7. Confirm data migration, support, communication, and rollback needs.
8. Make go/no-go criteria explicit.
9. Record deferred scope and rationale.
10. Review post-release evidence before expanding exposure.

## Decision points
Prefer scope reduction over quality reduction. Use phased rollout when uncertainty is operationally manageable; delay when critical correctness, safety, or compliance is unresolved.

## Common failure patterns
Treating all planned scope as mandatory, last-minute acceptance shortcuts, hidden release dependencies, no rollback plan, and declaring done without production readiness.

## Verification
Essential outcomes are verified, known risks are accepted by appropriate owners, and operational dependencies are ready.

## Expected output
A release scope and readiness decision with explicit inclusions, exclusions, risks, and go/no-go criteria.

## Stop conditions
Escalate when critical safety, legal, security, migration, or reliability risk lacks authorized acceptance.