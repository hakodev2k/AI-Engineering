# Rendering Rules

## Purpose
Keep React rendering deterministic, efficient, and free from side effects.

## Scope
Applies to render logic, conditional rendering, lists, memoization, and component updates.

## MUST
- Render functions MUST remain pure with respect to external systems and observable side effects.
- List items MUST use stable keys derived from identity rather than position when order or membership can change.
- Conditional rendering MUST preserve component identity intentionally when state retention matters.
- Expensive rendering claims MUST be supported by profiling evidence before optimization.
- Memoization MUST preserve correctness when dependencies change.

## MUST NOT
- MUST NOT perform network calls, subscriptions, mutations, or imperative DOM writes during render.
- MUST NOT use array indexes as keys for reorderable or mutable collections without evidence that identity is irrelevant.
- MUST NOT add `memo`, `useMemo`, or `useCallback` mechanically without a demonstrated need.

## SHOULD
- Prefer simple render paths and stable data shapes.
- Prefer measuring commit/render cost with profiling tools before tuning.

## Exceptions
Document the invariant, expected lifetime, measurement evidence, and reviewer approval for unusual identity or memoization strategies.

## Verification
Use React profiling, component tests, interaction tests, and review of key identity, purity, and memo dependencies.