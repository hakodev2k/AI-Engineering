# Spring Application Rules

## Purpose
Maintain explicit boundaries and predictable lifecycle behavior in Spring-based Java backends.

## Scope
Applies when Spring Framework or Spring Boot is used.

## MUST
- Dependency injection MUST make required collaborators explicit and testable.
- Bean scopes and lifecycle hooks MUST match actual ownership and concurrency requirements.
- Configuration properties MUST be typed, validated, and separated by environment.
- Transactional, async, caching, retry, and security annotations MUST be reviewed for proxy boundaries and actual invocation semantics.
- Framework auto-configuration that materially affects security, persistence, networking, or production behavior MUST be understood before relying on it.

## MUST NOT
- MUST NOT use the application context as a service locator to hide dependencies.
- MUST NOT assume self-invocation triggers proxy-based annotations.
- MUST NOT place business invariants solely in controllers or framework callbacks.

## SHOULD
- Prefer constructor injection and cohesive components.
- Keep domain logic independent of framework details where doing so improves testability and portability.

## Exceptions
Framework-specific shortcuts require a documented reason, bounded scope, and tests proving lifecycle and proxy behavior.

## Verification
Run context-startup tests, configuration validation, integration tests, architecture review, and targeted tests for transactions, security, async execution, retries, and bean lifecycle.