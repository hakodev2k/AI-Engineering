# Environment Isolation

## Purpose
Prevent accidental cross-environment access, mutation, and blast-radius expansion.

## Scope
Accounts, subscriptions, projects, workspaces, backends, variables, credentials, and naming.

## MUST
- Production MUST be isolated from lower environments through explicit state, credentials, and access boundaries.
- Environment selection MUST be deterministic and visible before execution.
- CI jobs MUST bind environment-specific credentials and configuration to the intended target.
- Shared resources MUST have explicit ownership and change governance.

## MUST NOT
- Workspace names alone MUST NOT be treated as a sufficient security boundary.
- Production credentials MUST NOT be available to untrusted pull-request execution.
- A lower-environment run MUST NOT be able to mutate production through ambiguous provider configuration.

## SHOULD
- Separate cloud accounts/projects/subscriptions SHOULD be used where risk justifies stronger isolation.
- Environment differences SHOULD be modeled explicitly rather than through pervasive conditional logic.

## Exceptions
Shared control-plane infrastructure requires documented boundaries, least privilege, blast-radius analysis, and approval.

## Verification
Inspect backend keys, workspace use, provider aliases, account IDs, credential scopes, CI environment protections, plans, and policy checks that assert target identity.