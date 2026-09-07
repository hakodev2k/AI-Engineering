# Environment and Configuration Rules

## Purpose
Prevent production failures caused by environment drift, unsafe configuration, missing prerequisites, or unintended target selection.

## Scope
Applies to environment-specific settings, runtime configuration, infrastructure prerequisites, secrets references, and release target selection.

## MUST
- Production target identity, region, tenant/account, namespace, and other relevant scope MUST be verified before execution.
- Configuration changes included in a release MUST be versioned or otherwise auditable and reviewed for production impact.
- Required environment prerequisites and configuration dependencies MUST be validated before the dependent release step.
- Material differences between validated pre-production environments and production MUST be documented and assessed for risk.
- Production configuration changes requiring approval MUST receive explicit human authorization before execution.

## MUST NOT
- Secrets or credentials MUST NOT be embedded in release documentation, source, logs, or commands where secret references can be used.
- Production values MUST NOT be copied blindly from lower environments.
- Security controls MUST NOT be disabled to make an environment resemble a test setup.

## SHOULD
- Configuration SHOULD be managed declaratively and reviewed through diff-based workflows where practical.
- Preflight checks SHOULD detect missing variables, permissions, endpoints, quotas, or incompatible runtime settings.

## Exceptions
A manual emergency configuration change requires documented scope, reason, expected effect, validation, rollback, risk, and authorized approval, followed by reconciliation into the managed source of truth.

## Verification
Inspect configuration diffs, target identifiers, environment inventories, preflight results, secret-handling controls, approval records, and post-change effective configuration.