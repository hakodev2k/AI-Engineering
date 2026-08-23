# JavaScript and TypeScript Engineering

## Purpose
Implement reliable frontend logic using modern JavaScript and TypeScript with deliberate type boundaries, runtime validation, predictable asynchronous behavior, and maintainable language patterns.

## When to use
Use for application logic, shared utilities, API contracts, refactoring weakly typed code, or reviewing language-level defects.

## Inputs
Source code, TypeScript configuration, package metadata, runtime targets, API schemas, lint rules, and failing examples.

## Context to inspect
Compiler strictness, module system, target browsers, generated types, nullability patterns, async code, error handling, and third-party type declarations.

## Core knowledge
TypeScript improves static confidence but does not validate runtime data. Narrow unknown values before use. Prefer explicit domain types over broad assertions. Understand closures, event loop semantics, promises, structural typing, discriminated unions, generics, immutability trade-offs, and module boundaries.

## Procedure
1. Reproduce or define the required behavior.
2. Inspect compiler and runtime constraints.
3. Model domain states so invalid combinations are difficult to represent.
4. Keep external data unknown until validated.
5. Use narrowing instead of unsafe assertions.
6. Make asynchronous ownership and cancellation explicit.
7. Avoid hidden mutation across module boundaries.
8. Handle expected failures with typed or documented contracts.
9. Add tests for edge states and runtime inputs.
10. Run type checking, linting, tests, and target-browser verification.

## Decision points
Use generics when they preserve relationships between values, not merely to avoid writing concrete types. Prefer runtime schema validation at untrusted boundaries; static interfaces are sufficient only for trusted compile-time relationships.

## Common failure patterns
`any` propagation, non-null assertions masking defects, floating promises, accidental shared mutation, over-generic abstractions, trusting API payloads, and confusing compile-time types with runtime guarantees.

## Verification
Type checking succeeds under project strictness, runtime boundary tests cover malformed data, async failures are handled, and generated bundles run in supported browsers.

## Expected output
Readable, type-safe frontend code with explicit runtime boundaries and verified behavior.

## Stop conditions
Stop when external contracts are undocumented, runtime compatibility cannot be determined, or fixing types would silently alter public behavior without approval.