# Dependency Injection Rules

## Purpose
Use Angular dependency injection as an explicit ownership and lifetime mechanism rather than hidden global state.

## Scope
Providers, injection tokens, environment providers, service scopes, factories, and dependency substitution.

## MUST
- Select provider scope according to intended lifetime and isolation.
- Use injection tokens or abstractions when consumers must not depend on a concrete infrastructure implementation.
- Keep provider factories deterministic and free from unexpected application side effects.
- Verify feature-scoped services do not accidentally become application singletons.

## MUST NOT
- Use root-provided mutable services as an unreviewed global store.
- Depend on DI lookup to conceal circular architecture dependencies.
- Put secrets or privileged credentials into client-side providers.

## SHOULD
- Prefer constructor/inject dependencies that make collaborators visible and test-substitutable.

## Exceptions
Global singleton state is valid for genuinely application-wide concerns when mutation ownership and reset semantics are defined.

## Verification
Inspect provider declarations, scopes, tokens, dependency graph, tests, and runtime instances where lifetime is material.