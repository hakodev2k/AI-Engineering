# Provider and Version Management

## Purpose
Make Terraform execution reproducible and provider upgrades controlled.

## Scope
Terraform CLI versions, providers, dependency lock files, constraints, and upgrades.

## MUST
- Supported Terraform and provider versions MUST be explicitly constrained.
- Dependency lock files MUST be reviewed and committed where appropriate for the execution model.
- Provider upgrades MUST be evaluated through plan output and relevant tests before production use.
- Major-version upgrades MUST document breaking changes and migration requirements.

## MUST NOT
- Production automation MUST NOT depend on unconstrained latest versions.
- Lock-file changes MUST NOT be accepted without understanding the dependency changes they introduce.
- Large provider upgrades MUST NOT be combined with unrelated infrastructure changes when separation is practical.

## SHOULD
- Version constraints SHOULD permit intentional patch/minor updates without admitting known incompatible majors.
- Upgrade cadence SHOULD prevent dependencies from becoming operationally obsolete.

## Exceptions
Emergency security upgrades may compress normal sequencing but still require evidence, review, rollback planning, and approval when production risk is material.

## Verification
Inspect required_version, required_providers, lock-file diffs, release notes, CI matrices, plan output, tests, and production rollout evidence.