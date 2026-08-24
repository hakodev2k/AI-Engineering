# Tool Use Safety

## Purpose
Constrain AI tool execution so model errors or manipulation cannot freely become real-world side effects.

## When to use
Use for agents that call APIs, execute code, modify files, send messages, purchase, deploy, or control infrastructure.

## Inputs
Tool schemas, permission model, side effects, identities, audit logs, user-intent model.

## Context to inspect
Credential scope, parameter validation, destination restrictions, transaction boundaries, confirmation UX, retries, and rollback.

## Core knowledge
Tool invocation is an authorization problem, not merely a generation problem. Least privilege, capability scoping, deterministic validation, idempotency, and auditability are primary controls.

## Procedure
1. Classify each tool by consequence and reversibility.
2. Remove unnecessary capabilities.
3. Scope credentials and resources per task.
4. Validate arguments outside the model.
5. Enforce authorization at execution time.
6. Require confirmation for sensitive actions.
7. Add idempotency and bounded retries.
8. Log intent, parameters, result, identity, and policy decision safely.
9. Test confused-deputy and chained-tool attacks.
10. Define emergency disable controls.

## Decision points
Prefer read-only tools by default. Split broad tools into narrow capabilities when authorization differs.

## Common failure patterns
Wildcard permissions; model-generated authorization decisions; hidden side effects; unbounded retries; credentials shared across users.

## Verification
Attempt unauthorized, malformed, replayed, and cross-user calls and confirm deterministic denial.

## Expected output
A least-privilege tool architecture with enforcement, tests, and auditable controls.

## Stop conditions
Escalate if privilege boundaries cannot be enforced independently of model output.