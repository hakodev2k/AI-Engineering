# Control Plane API Security

## Purpose
Secure privileged platform APIs that create, modify, delete, or expose infrastructure and tenant resources.

## When to use
Use when designing or reviewing platform APIs, administrative endpoints, automation controllers, webhooks, operators, or service-to-service control-plane integrations.

## Inputs
API contracts, authentication and authorization design, resource model, tenant model, validation rules, rate limits, idempotency behavior, audit requirements, and dependency topology.

## Context to inspect
Inspect every privileged operation, object ownership lookup, request validation, asynchronous jobs, callback/webhook paths, backend credentials, error responses, and audit events.

## Core knowledge
Control-plane APIs require stronger guarantees than ordinary data-plane APIs because small authorization or validation flaws may produce infrastructure-wide impact. Server-side ownership checks, explicit privilege boundaries, idempotency, and auditable mutations are essential.

## Procedure
1. Inventory endpoints and classify their blast radius.
2. Identify caller identities and required privileges.
3. Enforce authentication using short-lived trusted credentials.
4. Authorize each resource action server-side using canonical ownership data.
5. Validate schemas, enum values, references, limits, and dangerous free-form fields.
6. Prevent confused-deputy behavior when backend services hold broader privilege than callers.
7. Make destructive or retryable mutations idempotent where appropriate.
8. Apply rate limits and quotas based on abuse impact.
9. Protect webhooks and callbacks with authentication, replay protection, and bounded trust.
10. Return errors that are useful without disclosing sensitive platform state.
11. Emit immutable audit records for privileged changes.
12. Add negative tests for cross-tenant access, forged references, replay, privilege escalation, and malformed requests.

## Decision points
Use synchronous processing when callers need an immediate authoritative decision; use asynchronous workflows for long-running changes, but persist authorization context and prevent queued jobs from gaining broader privilege later.

## Common failure patterns
Trusting tenant IDs from requests, object-level authorization gaps, unrestricted backend impersonation, unauthenticated webhooks, missing replay protection, and retrying non-idempotent destructive actions.

## Verification
Verify all privileged endpoints have authentication, authorization, schema validation, tenant-boundary tests, audit events, and predictable retry behavior.

## Expected output
A hardened control-plane API with explicit privilege semantics, abuse controls, negative tests, and complete auditability.

## Stop conditions
Stop and escalate if an API exposes unrestricted platform-admin behavior, resource ownership cannot be verified authoritatively, or fixing authorization would require an unplanned breaking contract change.