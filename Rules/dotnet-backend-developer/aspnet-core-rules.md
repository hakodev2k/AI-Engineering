# ASP.NET Core Rules

## Purpose
Define safe and predictable conventions for ASP.NET Core request processing and hosting.

## Scope
Applies to middleware, endpoints, controllers, dependency injection, configuration, and hosting.

## MUST
- Request validation, authentication, authorization, and exception translation MUST occur at intentional boundaries.
- Service lifetimes MUST match resource ownership and thread-safety requirements.
- Middleware order MUST be deliberate and verified when behavior depends on ordering.
- Configuration required for startup MUST be validated early and fail clearly when invalid.
- Request cancellation MUST flow to downstream I/O where possible.
- Endpoint behavior MUST preserve documented HTTP and API contracts.

## MUST NOT
- MUST NOT inject scoped services into singletons without an approved scope strategy.
- MUST NOT place domain/business logic in middleware merely for convenience.
- MUST NOT expose internal exception details to clients in production.
- MUST NOT rely on development-only behavior for production correctness.

## SHOULD
- Prefer framework-native dependency injection, options, health checks, and problem-details support unless requirements justify alternatives.
- Keep endpoints thin and delegate business behavior to cohesive application/domain components.

## Exceptions
Deviations require documented rationale, lifecycle analysis, and tests proving request and host behavior.

## Verification
Use integration tests, startup/configuration tests, DI validation, middleware tests, HTTP contract tests, and deployment smoke tests.