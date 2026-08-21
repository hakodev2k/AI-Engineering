# Hooks Rules

## Purpose
Ensure React hooks preserve correctness, lifecycle safety, and predictable dependency behavior.

## Scope
Applies to built-in hooks, custom hooks, and hook-based abstractions.

## MUST
- Hooks MUST obey React hook ordering rules.
- Effect dependencies MUST represent the values actually used by the effect.
- Effects that start subscriptions, timers, requests, or listeners MUST define cleanup when lifecycle requires it.
- Custom hooks MUST expose cohesive behavior and document externally visible side effects.
- Effect-driven state synchronization MUST be justified against deriving the value during render.

## MUST NOT
- MUST NOT suppress hook dependency warnings merely to silence tooling.
- MUST NOT use effects as a default replacement for event handlers or pure derivation.
- MUST NOT hide global mutable behavior inside a custom hook without a clear contract.

## SHOULD
- Prefer pure computation, event handlers, or memoized derivation before adding an effect.
- Prefer small custom hooks around one lifecycle concern.

## Exceptions
A deliberate dependency omission requires documented invariants, reviewer approval, and tests proving the assumption.

## Verification
Use ESLint hook rules, strict-mode testing where applicable, component tests, and manual review of cleanup and dependency behavior.