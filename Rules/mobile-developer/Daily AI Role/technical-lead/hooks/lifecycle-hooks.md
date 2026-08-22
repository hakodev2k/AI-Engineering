# Lifecycle Hooks

Hooks are minimal, deterministic, idempotent, and must never perform hidden production mutations.

## task_start
Validate task brief contains objective, acceptance criteria, constraints, owner, risk level, and approval requirements.

## pre_implementation
Fail when a high-risk task lacks verification plan, rollback/recovery strategy, or explicit dependency owner.

## pre_review
Require implementation handoff, changed-surface list, and test evidence.

## post_review
Ensure P0/P1 findings are not marked accepted without explicit Technical Lead decision and documented rationale.

## pre_release
Run package/release checklist validation; surface missing evidence. Do not deploy.

## post_incident
Require follow-up owner for every structural prevention item and preserve incident evidence.

## Failure behavior
Hooks fail closed on malformed required contracts but emit actionable errors. They must not retry indefinitely.