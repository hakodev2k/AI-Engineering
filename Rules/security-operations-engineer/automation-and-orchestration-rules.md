# Automation and Orchestration Rules

## Purpose
Ensure security automation is controlled, observable, and safe.

## Scope
SOAR playbooks, scripted enrichment, automated containment, ticketing, notification, and remediation workflows.

## MUST
- Automations MUST define inputs, permissions, expected outputs, failure behavior, owner, and rollback or recovery path.
- High-impact automated actions MUST require approval or an explicitly approved pre-authorization policy.
- Automation failures MUST surface visibly and preserve sufficient diagnostics.
- Changes MUST be tested with representative safe scenarios before production use.

## MUST NOT
- MUST NOT grant automation broader privileges than required.
- MUST NOT allow silent partial failure that can leave incidents in an unknown state.

## SHOULD
- Automations SHOULD be idempotent where repeated execution is plausible.

## Exceptions
Emergency manual bypass requires documented reason, operator, scope, and retrospective review.

## Verification
Inspect workflow definitions, permissions, tests, run logs, approvals, failure alerts, and rollback evidence.