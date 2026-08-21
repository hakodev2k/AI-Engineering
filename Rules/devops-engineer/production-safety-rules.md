# Production Safety Rules

## Purpose
Protect production availability, data integrity, and recoverability during operational actions.

## Scope
Applies to deployments, infrastructure changes, production configuration, access changes, emergency operations, and destructive actions.

## MUST
- Production actions with material risk MUST define validation, blast radius, and rollback or recovery steps before execution.
- Destructive operations, infrastructure deletion, production secret rotation, and security-control weakening MUST require explicit human approval.
- Operators MUST verify the target environment and resource identity before high-impact commands run.
- Production automation MUST fail safely when required inputs, approvals, or validation evidence are missing.
- Critical changes MUST be monitored after execution until expected behavior is confirmed.

## MUST NOT
- MUST NOT use force, bypass, or disable safeguards merely to make a failing deployment succeed.
- MUST NOT run destructive commands copied from untrusted sources without independent review.
- MUST NOT perform broad production changes when a smaller bounded change can safely achieve the goal.
- MUST NOT report recovery until critical service behavior and telemetry are verified.

## SHOULD
- Prefer reversible actions, staged exposure, dry runs, and peer observation for unusual high-risk operations.
- Keep tested runbooks for recurring production procedures.

## Exceptions
Emergency action may shorten normal process only when delay creates greater risk; the action, approver, evidence, and follow-up work MUST be recorded.

## Verification
Use audit logs, command history, approval records, deployment telemetry, health checks, infrastructure diffs, rollback tests, and incident review.