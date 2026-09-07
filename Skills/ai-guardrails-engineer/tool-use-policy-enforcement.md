# Tool Use Policy Enforcement

## Purpose
Ensure tool calls obey authorization, scope, validation, and side-effect policy independently of model intent.

## When to use
Use for APIs, databases, browsers, code execution, messaging, admin, or side-effecting tools.

## Inputs
Schemas, identities, permissions, scopes, policies, risk, audit needs.

## Context to inspect
Inspect registration, arguments, credentials, identity, ownership, approvals, retries, results.

## Core knowledge
Models are not authorization engines. Server-side execution must enforce authenticated identity/capability; schemas do not replace semantic authorization.

## Procedure
1. Classify tool risk.
2. Define action authorization.
3. Bind least privilege.
4. Validate arguments.
5. Enforce tenant/resource ownership.
6. Require high-impact approval.
7. Add idempotency/replay protection.
8. Redact results.
9. Audit effects.
10. Test confused deputy.

## Decision points
Prefer narrow tools and separate read/write.

## Common failure patterns
Trusted model IDs, admin credentials, wildcard permissions, prompt validation, duplicate retries, output leakage.

## Verification
Unauthorized direct execution is denied independently of model behavior.

## Expected output
Tool policy matrix and abuse tests.

## Stop conditions
Stop without independent identity/resource enforcement.