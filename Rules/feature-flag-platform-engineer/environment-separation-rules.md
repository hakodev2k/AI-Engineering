# Environment Separation Rules

## Purpose
Prevent development and testing activity from unintentionally changing production feature behavior.

## Scope
Applies to projects, environments, credentials, configuration promotion, targeting data, and automation.

## MUST
- Production MUST be logically and permission-wise separated from lower environments.
- Credentials MUST be environment-scoped wherever the platform supports it.
- Automation MUST explicitly identify its target environment before mutating configuration.
- Configuration promotion MUST preserve intended differences rather than blindly copying all state.
- Production-only targeting data and secrets MUST NOT be replicated into lower environments without approved controls.

## MUST NOT
- MUST NOT use a development credential with production mutation authority.
- MUST NOT infer environment from a mutable default when executing destructive or production-impacting operations.
- MUST NOT bulk-sync flags across environments without reviewing environment-specific semantics.

## SHOULD
- Environment names and identifiers SHOULD be machine-validated in deployment tooling.

## Exceptions
Shared environments require documented risk controls and explicit ownership.

## Verification
Inspect IAM scopes, automation parameters, environment configuration diffs, promotion tooling, and production change logs.