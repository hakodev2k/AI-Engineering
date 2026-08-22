# SCIM Provisioning

## Purpose
Design and troubleshoot standards-based user and group provisioning with predictable lifecycle semantics and safe reconciliation.

## When to use
Use when integrating SaaS applications with an identity platform through SCIM or reviewing unreliable provisioning behavior.

## Inputs
SCIM endpoint documentation, schemas, source attributes, target constraints, group model, lifecycle requirements, logs, and test identities.

## Context to inspect
Inspect `/Users` and `/Groups` behavior, filtering, PATCH semantics, identifiers, uniqueness, active state, pagination, rate limits, retries, and custom schema extensions.

## Core knowledge
SCIM standardizes provisioning resources but implementations vary. Stable identifiers, idempotent updates, correct PATCH behavior, and clear disable/delete semantics are essential for safe automation.

## Procedure
1. Identify source and target identity keys.
2. Map required and optional attributes.
3. Validate create, lookup, update, disable, re-enable, and delete semantics.
4. Test group membership add/remove behavior.
5. Confirm pagination, filtering, and uniqueness behavior.
6. Design idempotent retries and rate-limit handling.
7. Define handling for malformed or unsupported attributes.
8. Protect provisioning credentials and restrict scope.
9. Enable detailed but non-sensitive audit logging.
10. Reconcile source and target periodically.

## Decision points
Prefer immutable provider IDs for correlation. Use disable rather than delete when target retention or recovery semantics require it. Custom extensions should be minimal and documented.

## Common failure patterns
Correlating by mutable username, duplicate creation after timeout, ignoring pagination, destructive delete assumptions, group drift, unbounded retries, and logging secrets or sensitive attributes.

## Verification
Execute a complete lifecycle test and confirm repeated requests remain safe, failed requests recover correctly, and reconciliation finds no unexplained drift.

## Expected output
A verified SCIM mapping and provisioning design with lifecycle semantics, retry behavior, monitoring, and test evidence.

## Stop conditions
Stop when the target violates required lifecycle semantics, stable correlation is impossible, or credentials cannot be scoped safely.