# TypeScript for React

## Purpose
Use TypeScript to make React component, state, event, and API contracts safer without creating type-level complexity that exceeds value.

## When to use
Use for component APIs, hooks, reducers, forms, API clients, and refactors.

## Inputs
Domain models, API schemas, component contracts, compiler configuration.

## Preconditions
Enable strictness appropriate to the codebase and understand generated vs handwritten types.

## Context to inspect
`tsconfig`, prop types, discriminated unions, nullable values, generic components, casts, `any` usage.

## Core knowledge
Types should model valid states and push invalid combinations out of the program. Narrowing and discriminated unions are usually safer than optional-property bags.

## Procedure
1. Model domain/UI states explicitly.
2. Use discriminated unions for mutually exclusive states.
3. Keep component generics only when they provide real reusable safety.
4. Type events/refs using React-provided types.
5. Avoid duplicated handwritten API models when schema generation exists.
6. Replace unsafe casts with validation/narrowing.
7. Treat external data as untrusted at runtime.
8. Keep exported public types stable and minimal.

## Decision points
Use runtime validation at external boundaries even when compile-time types exist.

## Common failure patterns
`any`, broad assertions, over-generic components, optional-everything models, confusing DTO/domain/view-model ownership.

## Verification
Strict typecheck, targeted tests for runtime boundaries, and review of casts/non-null assertions.

## Expected output
Readable types that encode real invariants.

## Stop conditions
Stop if upstream schemas are inconsistent and require contract alignment.