# Migration Safety Rules

## Purpose
Evolve database schemas and data without uncontrolled downtime, loss, or compatibility failure.

## Scope
DDL, data migrations, backfills, online changes, rollouts, and rollbacks.

## MUST
- Every migration MUST define prerequisites, compatibility assumptions, expected duration, validation, and failure recovery.
- Destructive or irreversible changes MUST require human approval and a tested recovery strategy.
- Changes used by independently deployed applications MUST support the required compatibility window.
- Large backfills MUST be bounded, observable, resumable where practical, and designed to limit contention.

## MUST NOT
- MUST NOT drop or reinterpret data before dependent consumers are proven migrated.
- MUST NOT execute destructive production DDL or DML automatically without explicit authorization.
- MUST NOT assume transactional DDL behavior without confirming the target engine.

## SHOULD
- Prefer expand-migrate-contract patterns for breaking schema evolution.
- Rehearse high-risk migrations on production-like scale.

## Exceptions
Emergency changes require incident context, named approver, bounded blast radius, recovery plan, and post-change verification.

## Verification
Review migration diffs and dependency inventory; test forward and recovery paths; measure locks and duration; verify row counts, constraints, application compatibility, and post-deployment health.