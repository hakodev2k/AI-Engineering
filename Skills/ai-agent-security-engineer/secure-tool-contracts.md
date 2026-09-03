# Secure Tool Contracts

## Purpose
Design tool interfaces that constrain model-generated actions, reject ambiguous arguments, and make unsafe states difficult to express.

## When to use
Use when creating or reviewing agent tools, function-calling schemas, MCP-style capabilities, or adapters around existing APIs.

## Inputs
Underlying API contract, agent use cases, authorization rules, data classification, error semantics, and side-effect taxonomy.

## Preconditions
Know which tool operations are safe, privileged, irreversible, or security-sensitive.

## Context to inspect
Function schemas, parameter types, defaults, validation, backend authorization, retries, response payloads, and error handling.

## Core knowledge
Tool schemas are part of the security boundary but are not authorization. Narrow contracts reduce accidental and adversarial misuse. Model-produced parameters must be treated as untrusted input.

## Procedure
1. Split multi-purpose tools into focused operations where risk differs.
2. Remove parameters the agent does not need.
3. Use strict types, enums, bounds, formats, and required fields.
4. Avoid free-form command, SQL, path, or URL parameters unless explicitly required and sandboxed.
5. Validate identifiers against authorized resources server-side.
6. Separate read-only and mutating operations.
7. Add explicit idempotency support for retried writes.
8. Return minimal data required for the next reasoning step.
9. Normalize errors without leaking secrets or internal details.
10. Reject unknown fields and invalid combinations.
11. Test malformed, oversized, encoded, adversarial, and cross-tenant arguments.
12. Version contracts when semantics change.

## Decision points
Prefer purpose-built APIs over exposing shell, browser, SQL, or generic HTTP tools. Use a generic tool only when flexibility is essential and an isolation boundary contains its effects.

## Common failure patterns
Free-form execution parameters, implicit defaults that create side effects, client-side-only validation, verbose secret-bearing responses, and weak resource authorization.

## Verification
Use negative tests to prove malformed and unauthorized calls fail before side effects. Confirm retries do not duplicate writes.

## Expected output
A minimal, typed, validated tool contract with explicit authorization, error, and idempotency behavior.

## Stop conditions
Escalate if the required workflow depends on unbounded command execution without an adequate sandbox or policy layer.