# Configuration Management

## Purpose
Control environment configuration so changes are traceable, validated, and reversible.

## When to use
Use for application settings, runtime flags, infrastructure configuration, environment overlays, or drift reduction.

## Inputs
Configuration schema, environments, defaults, secret references, rollout behavior.

## Context to inspect
Config repositories, environment variables, feature flags, IaC, runtime overrides, undocumented manual settings.

## Core knowledge
Separate config from code where values vary by environment, but version and validate it. Secrets are configuration but require different storage. Avoid snowflake environments.

## Procedure
1. Inventory config sources and precedence.
2. Define typed/schema-validated configuration.
3. Establish sane non-secret defaults.
4. Externalize environment-specific values.
5. Store secrets by reference.
6. Version config changes where possible.
7. Add validation before deploy/startup.
8. Remove manual out-of-band drift.
9. Define safe rollout/reload behavior.
10. Audit effective configuration during incidents.

## Decision points
Use feature flags for behavioral rollout, not permanent configuration sprawl; restart for immutable config when hot reload adds unsafe complexity.

## Common failure patterns
Unknown precedence, config copied manually, secrets in config repo, stale flags, production-only undocumented values.

## Verification
Effective config is reproducible, validation catches bad values, and rollback restores prior behavior.

## Expected output
Documented configuration sources, schema, ownership, and deployment behavior.

## Stop conditions
Stop when configuration ownership or secret handling is ambiguous.