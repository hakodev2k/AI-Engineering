# Production Safety Rules

## Purpose
Prevent automation from causing unsafe production changes, data loss, security exposure, or customer impact.

## Scope
Applies whenever automation can access production or production-like privileged systems.

## MUST
- Production automation MUST be read-only by default unless an explicitly approved test design requires mutation.
- Destructive actions, data deletion, permission changes, secret rotation, traffic generation, or configuration changes MUST require explicit human authorization and safeguards.
- Test identities MUST use least privilege and be distinguishable from real users where appropriate.
- Any production mutation MUST define cleanup, rollback, blast radius, monitoring, and stop conditions.

## MUST NOT
- MUST NOT run load, destructive, chaos, or security mutation tests against production without authorization.
- MUST NOT disable monitoring or security controls to enable tests.
- MUST NOT let an AI agent silently escalate from analysis/preparation to execution of dangerous actions.

## SHOULD
- Prefer production-like isolated environments for destructive validation.
- Prefer synthetic monitoring that cannot alter customer state.

## Exceptions
Approved production experiments require named owner, authorization, risk assessment, rollback, observability, and bounded scope.

## Verification
Review permissions, environment guards, approval records, dry-run behavior, audit logs, cleanup, and stop controls.