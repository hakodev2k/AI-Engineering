# API Security Rules

## Purpose
Protect API contracts from unauthorized access, abuse, injection, replay, excessive exposure, and unsafe evolution.

## Scope
Applies to HTTP, RPC, GraphQL, webhook, and machine-consumed application interfaces.

## MUST
- Every non-public API operation MUST have explicit authentication and authorization semantics.
- Object and field exposure MUST be minimized to the contract required by the caller.
- Request size, pagination, query complexity, concurrency, and other attacker-controlled resource dimensions MUST be bounded where abuse can affect availability or cost.
- State-changing operations vulnerable to retries or replay MUST define idempotency or duplicate-handling behavior where required by the business risk.
- Webhook authenticity and replay protection MUST be validated before processing privileged effects.
- Security-relevant breaking changes MUST have an approved migration and consumer-impact plan.

## MUST NOT
- MUST NOT trust identifiers, roles, tenant IDs, prices, ownership, or privilege assertions supplied by a client unless independently authorized.
- MUST NOT expose internal exception details, secrets, or sensitive implementation metadata in API errors.
- MUST NOT rely on rate limiting as the sole control for authorization or business-rule enforcement.

## SHOULD
- SHOULD use explicit schemas and contract tests for security-sensitive fields.
- SHOULD separate public, partner, administrative, and internal trust assumptions.

## Exceptions
Exceptions require documented caller model, threat analysis, compensating controls, bounded scope, and approval.

## Verification
Use contract inspection, authorization tests, schema tests, fuzzing, replay/idempotency tests, rate/complexity tests, error inspection, and targeted API security testing.