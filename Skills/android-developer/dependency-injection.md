# Dependency Injection

## Purpose
Structure Android dependencies so construction, lifetime, replacement, and testing are explicit without turning the object graph into hidden global state.

## When to use
Use when introducing or reviewing Hilt/Dagger/manual DI, feature scopes, test doubles, or dependency cycles.

## Inputs
Object graph, module boundaries, lifecycle scopes, interfaces, startup paths, test strategy.

## Preconditions
Understand ownership and required lifetime of each dependency.

## Context to inspect
Application/activity/ViewModel scopes, Hilt modules, qualifiers, factories, assisted injection, singleton use, repositories, network/database clients.

## Core knowledge
DI separates object construction from use. Scope is a correctness decision: overly broad scopes retain state and resources; overly narrow scopes recreate expensive or identity-sensitive objects.

## Procedure
1. Map runtime dependencies from entry points to infrastructure.
2. Remove service-locator access from business code where practical.
3. Assign the narrowest correct lifetime to each dependency.
4. Use interfaces where substitution or boundary isolation has real value.
5. Use qualifiers for semantically distinct bindings.
6. Break dependency cycles by revisiting responsibilities, not providers alone.
7. Keep configuration and credentials outside consumers.
8. Define test replacements at stable boundaries.
9. Check startup cost of eager singletons.
10. Verify graph compilation and lifecycle behavior.

## Decision points
Prefer constructor injection. Use factories/assisted injection for runtime parameters. Avoid interfaces that merely mirror concrete classes without a boundary or substitution need.

## Common failure patterns
Everything scoped singleton, hidden mutable state, component cycles, injecting Activity into long-lived objects, duplicate bindings, and DI modules containing business logic.

## Verification
Compile the graph, run unit/instrumentation tests with replacements, and inspect lifecycle-sensitive dependencies for correct creation/destruction.

## Expected output
Clear object graph, justified scopes, replaceable boundaries, and passing graph/tests.

## Stop conditions
Escalate when scope requirements conflict, dependency cycles reveal unresolved architecture ownership, or third-party construction cannot be safely controlled.