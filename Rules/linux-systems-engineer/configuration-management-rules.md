# Configuration Management Rules

## Purpose
Make host state reproducible, reviewable, and recoverable while preventing unmanaged drift.

## Scope
Applies to configuration-management systems, images, templates, host variables, generated files, and manual changes.

## MUST
- Desired production configuration MUST have an authoritative managed source.
- Configuration changes MUST be reviewable and attributable before broad deployment.
- Automation MUST be idempotent or explicitly document non-idempotent effects.
- Secrets MUST be referenced through approved secret mechanisms rather than stored in ordinary configuration.
- Drift affecting security, reliability, or compliance MUST be detected and remediated or explicitly accepted.
- Changes MUST be scoped to intended hosts using selectors that can be independently verified.

## MUST NOT
- Manual production edits MUST NOT become the undocumented long-term source of truth.
- Automation MUST NOT silently overwrite unknown local state when that state may represent data or an active incident workaround.
- Broad selectors such as all hosts MUST NOT be used for high-risk changes without staged rollout controls.

## SHOULD
- Validate syntax and render templates before deployment.
- Separate environment data from reusable logic.
- Prefer immutable replacement for highly divergent hosts when practical.

## Exceptions
Emergency manual changes require timestamp, operator, reason, affected hosts, validation, and a follow-up action to codify or revert the change.

## Verification
Run dry-run/diff capabilities where trustworthy, inspect generated configuration, compare desired and actual state, test idempotence, validate host targeting, and confirm drift after deployment.