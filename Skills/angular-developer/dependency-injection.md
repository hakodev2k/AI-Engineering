# Dependency Injection

## Purpose
Use Angular dependency injection to create explicit service lifetimes, replaceable boundaries, and testable features without hidden global coupling.

## When to use
Use when designing services/providers, feature scopes, tokens, factories, or diagnosing unexpected shared state.

## Inputs
Service responsibilities, desired lifetime, configuration, feature boundaries, and tests.

## Context to inspect
Inspect provider declarations, injection tokens, root/route/component scopes, factories, and mutable service state.

## Core knowledge
Provider scope determines instance lifetime and state sharing. Injection tokens make non-class contracts and configuration explicit. DI should expose dependencies, not conceal service-locator behavior.

## Procedure
1. Define the dependency contract and ownership.
2. Choose the narrowest lifetime matching required sharing.
3. Use tokens for configuration or abstract contracts when valuable.
4. Keep constructors/injection sites focused.
5. Avoid mutable singleton state unless intentionally application-wide.
6. Scope feature services at routes/components when isolation matters.
7. Override boundaries cleanly in tests.
8. Verify lifecycle and cleanup behavior.

## Decision points
Root scope suits stateless or truly application-wide services; narrower providers suit isolated feature/session state. Do not add interfaces/tokens without substitution or boundary value.

## Common failure patterns
Accidental singleton state, duplicate providers, circular dependencies, service locator patterns, and injecting broad god services everywhere.

## Verification
Confirm expected instance sharing/isolation, tests can replace external boundaries, and no dependency cycles are introduced.

## Expected output
Explicit DI contracts and intentional service lifetimes.

## Stop conditions
Stop when ownership/lifetime requirements cannot be established.