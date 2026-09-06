# Authentication and Secret Handling

## Purpose
Design developer-facing authentication and secret workflows that are secure, comprehensible, automatable, and appropriate for local, CI, and production environments.

## When to use
Use when adding API keys, OAuth, service accounts, workload identity, token exchange, CLI login, or credential rotation workflows.

## Inputs
Identity architecture, supported environments, authorization model, secret-storage options, token lifetimes, SDK/CLI behavior, compliance constraints, and incident history.

## Context to inspect
Inspect account setup, credential creation, environment variables, config files, secret managers, CI integration, token refresh, revocation, logging, examples, and current documentation.

## Core knowledge
Authentication proves identity; authorization determines allowed actions. Developer tooling should use least privilege, avoid durable secrets where stronger workload identity exists, clearly distinguish local and production patterns, and make rotation and revocation routine rather than exceptional.

## Procedure
1. Identify actors and environments.
2. Map required permissions to least-privilege credentials.
3. Choose interactive, service, or workload-identity flows by environment.
4. Define creation, storage, loading, refresh, rotation, and revocation.
5. Specify configuration precedence without printing secrets.
6. Prevent credentials from entering source control, command history, telemetry, or exception output.
7. Provide CI examples using native secret stores.
8. Add clear unauthorized versus forbidden diagnostics.
9. Test expiry, revocation, clock skew, malformed tokens, and permission changes.
10. Document incident-response actions for compromised credentials.

## Decision points
Prefer short-lived identity federation over static secrets in production when available. Use API keys for simple server-to-server scenarios only when their scope, storage, and rotation are manageable.

## Common failure patterns
Embedding secrets in samples, broad default scopes, confusing 401 and 403, hidden credential precedence, no rotation path, logging authorization headers, and reusing local credentials in production.

## Verification
Scan repositories and logs for secrets, test least privilege, rotate and revoke credentials, verify expired-token behavior, and exercise CI using noninteractive identity.

## Expected output
A secure credential workflow with environment-specific guidance, permission boundaries, tests, and rotation procedures.

## Stop conditions
Stop if identity ownership is unresolved, secure secret storage is unavailable, required privileges exceed approved scope, or documentation would encourage insecure credential handling.