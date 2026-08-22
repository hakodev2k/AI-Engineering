# REST API Design

## Purpose
Design stable HTTP APIs with clear resource boundaries, contracts, status semantics, authorization, idempotency, and evolution strategy.

## When to use
New endpoints, contract redesigns, public/internal integration APIs, or backward-compatibility reviews.

## Inputs
Business requirement, consumers, existing conventions, domain model, security rules, versioning constraints.

## Context to inspect
Existing routes, OpenAPI, error format, auth policies, pagination/filtering conventions, client dependencies.

## Core knowledge
HTTP method semantics, resource modeling, status codes, idempotency, conditional requests, pagination, validation, problem details, compatibility, versioning.

## Procedure
1. Identify consumer goal and resource boundary.
2. Choose method and URI by semantics.
3. Define explicit request/response DTOs.
4. Define validation and authorization.
5. Define success/error/status behavior.
6. Consider idempotency and retries.
7. Add pagination/filtering/sorting only when required.
8. Check concurrency and conditional update needs.
9. Assess backward compatibility.
10. Update OpenAPI and tests.

## Decision points
Prefer additive compatible evolution over versioning. Use PUT for full idempotent replacement, PATCH for partial change when semantics are controlled, POST for non-idempotent creation/actions unless an idempotency key is supported.

## Common failure patterns
RPC-style endpoints everywhere, exposing persistence models, inconsistent errors, missing auth, unbounded lists, undocumented null semantics, breaking clients silently.

## Verification
Contract tests, auth tests, OpenAPI validation, representative client scenarios, compatibility review.

## Expected output
A consumer-focused API contract with explicit operational semantics.

## Stop conditions
Stop when business semantics or compatibility impact cannot be resolved without product/consumer input.