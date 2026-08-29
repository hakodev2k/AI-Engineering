# CI/CD Hardening Rules

## Purpose
Reduce the risk that delivery automation becomes an uncontrolled path to source, artifacts, or production.

## Scope
Applies to CI/CD workflows, runners, reusable actions, plugins, service identities, caches, and deployment jobs.

## MUST
- CI/CD permissions MUST follow least privilege and be scoped per workflow or job where supported.
- Third-party workflow components MUST be pinned to immutable or controlled versions.
- Privileged workflows MUST require protected source context and approved change review.
- Secrets and deployment credentials MUST be available only to jobs that require them.
- Changes to release or deployment workflows MUST receive risk-proportionate review.

## MUST NOT
- MUST NOT expose privileged credentials to untrusted contribution contexts.
- MUST NOT execute mutable third-party automation in privileged release jobs without review.

## SHOULD
- Runners SHOULD be ephemeral for high-trust workloads.
- CI/CD policy checks SHOULD be enforced centrally where feasible.

## Exceptions
Exceptions MUST document the workflow, reason, residual risk, compensating controls, duration, and approval.

## Verification
Inspect workflow definitions, identity scopes, runner settings, secret exposure rules, third-party references, and branch protections. Confirm untrusted jobs cannot inherit privileged release authority.