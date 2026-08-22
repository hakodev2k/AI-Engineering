# TypeScript in Vue

## Purpose
Use TypeScript to strengthen Vue component, composable, store, and API contracts without creating brittle type complexity.

## When to use
Use in TypeScript Vue projects, migrations from JavaScript, public component APIs, and type-safety reviews.

## Inputs
Source code, tsconfig, Vue tooling, API types, and component contracts.

## Context to inspect
Inspect strictness settings, generated API types, shared models, macros, linting, and build tooling.

## Core knowledge
Types should encode meaningful invariants and boundaries. Runtime input remains untrusted even when statically typed. Prefer inference locally and explicit types at public boundaries.

## Procedure
1. Enable appropriate strictness and identify unsafe escapes.
2. Type props, emits, template refs, composables, and store APIs.
3. Separate transport DTOs from domain/UI models when semantics differ.
4. Narrow unknown external values through runtime validation.
5. Prefer discriminated unions for meaningful state variants.
6. Remove unjustified non-null assertions and any usage.
7. Keep generics focused on real reuse.
8. Run type checks independently of transpilation.

## Decision points
Generate types from authoritative schemas when possible; hand-maintain domain types when they intentionally differ. Use runtime schemas at trust boundaries.

## Common failure patterns
Casting instead of validating, duplicated incompatible DTO types, pervasive any, over-generic components, unsafe template refs, and types that claim impossible runtime guarantees.

## Verification
Run vue-tsc/type checking, build, tests, and inspect external-data validation paths.

## Expected output
Useful compile-time guarantees aligned with runtime reality.

## Stop conditions
Stop when authoritative external schemas are unavailable and guessing types could conceal compatibility defects.