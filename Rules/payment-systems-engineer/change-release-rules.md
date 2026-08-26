# Payment Change and Release Rules

## Purpose
Prevent unsafe production changes to financial behavior, contracts, and processing infrastructure.

## Scope
Application releases, payment configuration, provider migrations, schema changes, routing changes, and operational feature flags.

## MUST
- Changes that can alter financial outcomes MUST receive review from an accountable engineer and appropriate business or risk owner.
- Releases MUST define rollback or forward-fix strategy before production execution.
- Database and contract changes MUST preserve compatibility across in-flight payment operations and asynchronous events.
- Provider migrations MUST include dual-read, shadow, phased, or equivalent evidence where practical before full cutover.
- Feature flags controlling money movement MUST be auditable and access-restricted.

## MUST NOT
- MUST NOT perform breaking payment-contract changes without an approved migration plan.
- MUST NOT use production as the first environment to validate financial-state transitions.
- MUST NOT force push or rewrite shared Git history to conceal or bypass payment change review.

## SHOULD
- High-risk releases SHOULD use phased rollout with explicit stop criteria and financial-health monitoring.

## Exceptions
Emergency changes require explicit approval, minimal scope, evidence capture, and retrospective review.

## Verification
Inspect pull requests, approvals, migration plans, rollout telemetry, feature-flag audit logs, and rollback evidence.