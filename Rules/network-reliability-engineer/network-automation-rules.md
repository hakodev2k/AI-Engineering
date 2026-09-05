# Network Automation Rules

## Purpose
Make network automation predictable, reviewable, idempotent where appropriate, and safe under partial failure.

## Scope
Configuration automation, orchestration, inventory integration, scheduled jobs, and remediation tooling.

## MUST
- Automation MUST validate targets and intended scope before making changes.
- Repeated execution MUST have defined behavior and MUST NOT create uncontrolled duplicate effects.
- Partial failures MUST be surfaced with enough evidence to identify which targets changed and which did not.
- High-risk automation MUST support dry-run, staged execution, or equivalent pre-change validation where practical.
- Credentials used by automation MUST follow least-privilege requirements.

## MUST NOT
- MUST NOT expand a change beyond the requested target set silently.
- MUST NOT continue after failed safety preconditions.
- MUST NOT hide per-target failures behind an aggregate success status.

## SHOULD
- Prefer deterministic templates and structured inputs.
- Add rate limits and bounded concurrency for broad changes.

## Exceptions
Exceptions require reason, scope, safeguards, rollback, and approval.

## Verification
Inspect automation code, target resolution, CI tests, dry-run output, execution logs, and credential permissions.