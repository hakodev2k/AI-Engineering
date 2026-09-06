# Deployment and Rollout Rules

## Purpose
Coordinate schema changes with application deployment so compatible contracts remain available throughout rollout.

## Scope
Producer and consumer deployment sequencing, canaries, phased rollout, rollback, and validation.

## MUST
- Rollout plans MUST reflect the selected compatibility mode and actual reader/writer behavior.
- New producer schemas MUST be registered and validated before production emission begins.
- Deployments that depend on consumer readiness MUST verify readiness before producer cutover.
- Rollback MUST be tested against schemas that may have been written during rollout.
- Progressive rollout MUST define observable success and abort criteria for high-impact changes.

## MUST NOT
- MUST NOT assume application rollback restores previously emitted data to an older schema.
- MUST NOT remove old schema support before the migration window closes.
- MUST NOT perform production cutover without a known rollback boundary.

## SHOULD
- Prefer canary or staged rollout for widely consumed contracts.
- Preserve compatibility during mixed-version deployment windows.

## Exceptions
Single-step cutovers require bounded consumer set, explicit coordination, tested rollback, and approval.

## Verification
Review deployment order, canary evidence, compatibility checks, rollback tests, and post-rollout metrics.