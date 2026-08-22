# REST Resource Modeling

## Purpose
Model HTTP APIs around coherent resources, relationships, and state transitions.

## When to use
Use when designing or refactoring REST-style APIs.

## Inputs
Domain concepts, workflows, consumer operations, and existing API conventions.

## Context to inspect
Domain boundaries, current routes, identifiers, lifecycle states, and authorization rules.

## Core knowledge
REST resource design favors nouns, representations, standard HTTP semantics, stateless requests, cache-aware behavior, and explicit state transitions.

## Procedure
1. Map consumer actions to domain resources.
2. Identify canonical identifiers and ownership.
3. Define collection and item routes.
4. Map operations to HTTP methods.
5. Model relationships without excessive nesting.
6. Define lifecycle transitions and conflict behavior.
7. Specify response codes and representations.
8. Review caching and concurrency semantics.
9. Test common and exceptional workflows.

## Decision points
Use subresources when lifecycle or ownership is genuinely subordinate. Use action endpoints only when a domain operation cannot be represented cleanly as resource state.

## Common failure patterns
RPC disguised as REST, deeply nested URLs, verbs everywhere, overloaded PUT/PATCH semantics, and inconsistent identifiers.

## Verification
Walk representative workflows through the resource model and verify method safety, idempotency, status codes, and authorization.

## Expected output
A coherent resource model and route design.

## Stop conditions
Stop when domain ownership or lifecycle semantics cannot be established reliably.