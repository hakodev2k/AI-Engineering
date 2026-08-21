# API Security

## Purpose
Secure API boundaries against unauthorized access, abuse, injection, data leakage, replay, and unsafe integration behavior.

## When to use
Use when designing or reviewing public APIs, internal service APIs, webhooks, partner integrations, and administrative endpoints.

## Inputs
API contracts, identity model, authorization rules, data classification, rate limits, threat model, consumer inventory.

## Context to inspect
Routes, schemas, authentication middleware, authorization checks, validation, pagination, error responses, CORS, rate limiting, idempotency, webhooks, and logging.

## Core knowledge
API security depends on strong server-side authorization, strict input handling, bounded resource usage, and safe error behavior. Object-level authorization and business-flow abuse are common high-impact risks.

## Procedure
1. Inventory API consumers and trust levels.
2. Classify endpoints by sensitivity and privilege.
3. Validate authentication strength and token audience/scope.
4. Enforce object- and action-level authorization server-side.
5. Validate request shape, size, type, ranges, and business invariants.
6. Apply rate, concurrency, and payload limits based on abuse risk.
7. Protect idempotent/retryable operations from replay and duplication.
8. Review CORS, webhook verification, and outbound callback trust.
9. Standardize errors to avoid sensitive disclosure.
10. Add negative tests for unauthorized, malformed, excessive, and replayed requests.

## Decision points
Use coarse gateway controls for cross-cutting concerns, but keep resource authorization in the owning service. Stronger throttling is justified for expensive or abuse-prone endpoints.

## Common failure patterns
IDOR/BOLA, broad scopes, trusting client-provided ownership fields, missing request limits, weak webhook validation, permissive CORS, and exposing stack traces.

## Verification
Automated tests prove denied access for unauthorized objects/actions, malformed inputs are rejected safely, rate limits work, and webhook/replay controls behave as intended.

## Expected output
A hardened API boundary with explicit identity, authorization, validation, abuse controls, and regression tests.

## Stop conditions
Escalate when access rules are ambiguous, external consumer contracts cannot safely change, or testing requires unapproved production traffic.