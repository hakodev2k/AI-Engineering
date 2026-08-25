# Secure Change Management

## Purpose
Control cloud security risk introduced by operational and infrastructure changes.

## Scope
IAM, network, encryption, logging, policy, service configuration, and security-tool changes.

## MUST
- Security-impacting changes MUST state intended effect, affected scope, validation method, and rollback or recovery plan when applicable.
- High-risk production changes MUST receive authorized human approval before execution.
- Emergency changes MUST be auditable and reviewed after stabilization.
- Changes MUST be verified against effective cloud state, not only requested configuration.

## MUST NOT
- MUST NOT weaken security controls merely to unblock deployment without explicit risk acceptance.
- MUST NOT combine unrelated high-risk changes when separation would improve review or rollback.
- MUST NOT force-push or rewrite shared history as part of normal change delivery.

## SHOULD
- Prefer small, reversible, staged changes with automated policy checks.

## Exceptions
Document urgency, risk, authority, compensating safeguards, validation, and follow-up review.

## Verification
Inspect change records, diffs, plans, approvals, deployment logs, effective configuration, rollback evidence, and post-change monitoring.