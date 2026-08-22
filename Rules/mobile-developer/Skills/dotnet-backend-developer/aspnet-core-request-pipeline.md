# ASP.NET Core Request Pipeline

## Purpose
Design and troubleshoot ASP.NET Core request processing with correct middleware ordering, DI lifetimes, endpoint behavior, error handling, and production safety.

## When to use
New APIs, middleware changes, authentication/authorization integration, global exception handling, routing problems, or request-lifecycle defects.

## Inputs
Repository, hosting model, middleware registrations, endpoint definitions, logs, requirements.

## Preconditions
Know the target ASP.NET Core version and deployment topology.

## Context to inspect
`Program.cs`, service registration, middleware order, endpoint mapping, filters, exception handlers, forwarded headers, configuration.

## Core knowledge
Middleware is ordered; scoped services follow request lifetime; endpoint routing selects handlers; authentication establishes identity while authorization evaluates access; exception handling must not leak internals.

## Procedure
1. Trace one request from ingress to endpoint and response.
2. Verify proxy/forwarded-header assumptions.
3. Check routing and middleware order.
4. Validate DI lifetimes and captive dependencies.
5. Place exception handling early enough to capture downstream failures.
6. Confirm authentication precedes authorization.
7. Keep middleware focused and non-blocking.
8. Enforce request-size/time limits where needed.
9. Add integration tests for critical order-dependent behavior.

## Decision points
Use middleware for cross-cutting HTTP concerns, filters for MVC/endpoint concerns, and services for business logic. Avoid custom middleware when framework primitives already solve the problem.

## Common failure patterns
Wrong ordering, singleton depending on scoped service, blocking I/O, duplicate exception handling, trusting proxy headers blindly, large request buffering, leaking exception details.

## Verification
Exercise representative requests through integration tests and inspect structured logs/status codes.

## Expected output
Predictable, secure, observable request processing.

## Stop conditions
Escalate topology/security changes requiring infrastructure or identity-owner approval.