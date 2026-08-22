# Composition API Rules

## Purpose
Use Vue's Composition API predictably without creating hidden lifecycle, reactivity, or ownership defects.

## Scope
setup logic, composables, lifecycle hooks, dependency injection, and reusable reactive behavior.

## MUST
- Composables MUST expose an intentional API and document side effects, lifecycle assumptions, and required providers when non-obvious.
- Side effects MUST be registered and cleaned up according to component or effect lifetime.
- Shared composables MUST distinguish caller-owned inputs from internally owned mutable state.
- Lifecycle-dependent behavior MUST execute in the correct Vue lifecycle phase.
- Dependencies used by a composable MUST be explicit through parameters, injection contracts, or documented platform dependencies.

## MUST NOT
- Composables MUST NOT silently install global listeners, timers, observers, or subscriptions without deterministic cleanup.
- setup logic MUST NOT depend on invocation order between unrelated composables.
- Composables MUST NOT mutate caller state unless mutation is an explicit part of their contract.

## SHOULD
- Extract reusable behavior when it has a coherent responsibility, not merely to reduce line count.
- Prefer small composable interfaces that preserve encapsulation over exposing every internal ref.

## Exceptions
Application bootstrap composables may intentionally have process-lifetime effects when ownership and teardown expectations are explicit.

## Verification
Inspect lifecycle registration, cleanup paths, exposed state, dependency contracts, and tests that mount/unmount consumers.