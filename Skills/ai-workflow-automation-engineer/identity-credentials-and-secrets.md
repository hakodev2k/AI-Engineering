# Identity, Credentials, and Secrets

## Purpose
Design workflow authentication and secret handling so integrations use least privilege, remain rotatable, and do not leak credentials through logs, payloads, or exports.

## When to use
Use when a workflow authenticates to APIs, databases, cloud services, SaaS platforms, queues, or internal systems.

## Inputs
Identity model, required operations, credential types, secret stores, rotation policy, environment boundaries, and audit requirements.

## Context to inspect
Inspect existing service accounts, OAuth apps, scopes, secret-store integration, shared credentials, export behavior, logs, environment variables, and emergency rotation procedures.

## Core knowledge
Prefer workload identity or short-lived credentials over static secrets. Authentication proves identity; authorization constrains action. Credential lifecycle includes creation, storage, distribution, use, audit, rotation, and revocation.

## Procedure
1. Inventory every external operation performed by the workflow.
2. Map each operation to the minimum required permission.
3. Prefer dedicated machine identities over shared human accounts.
4. Choose short-lived or managed identity mechanisms when available.
5. Store secrets only in approved secret-management facilities.
6. Keep secrets out of workflow definitions, source control, logs, and test fixtures.
7. Separate credentials by environment and privilege boundary.
8. Define rotation and revocation procedures.
9. Validate audit logging for privileged actions.
10. Test behavior when credentials expire or are revoked.
11. Periodically review unused scopes and stale identities.

## Decision points
Use OAuth delegation when acting on behalf of a user is required. Use service identities for system-owned actions. Split identities when different workflow steps require materially different privileges.

## Common failure patterns
Shared administrator tokens, long-lived API keys, secrets in node parameters or logs, production credentials used in testing, and no documented rotation path.

## Verification
Inspect effective permissions, rotate a nonproduction credential, confirm workflows recover as designed, and scan exports/logs for secret exposure.

## Expected output
A credential architecture with identity ownership, least-privilege scopes, secret storage, rotation, revocation, environment separation, and audit controls.

## Stop conditions
Stop when required access can only be obtained through uncontrolled shared credentials or when secret storage does not meet organizational security requirements.