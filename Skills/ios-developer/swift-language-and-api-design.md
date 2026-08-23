# Swift Language and API Design

## Purpose
Design maintainable Swift code and APIs using the language's type system, value semantics, protocols, generics, error handling, and ownership model.

## When to use
Use when adding shared models, domain logic, framework-facing APIs, or refactoring unsafe Swift. Do not redesign stable public APIs without compatibility requirements.

## Inputs
Requirements, supported Swift/iOS versions, existing conventions, call sites, performance constraints.

## Context to inspect
Module boundaries, access levels, protocol use, Sendable/concurrency constraints, error model, tests, binary/source compatibility needs.

## Core knowledge
Prefer explicit domain types, value semantics where appropriate, narrow protocols, exhaustive enums, structured errors, and APIs that make invalid states difficult to express. Abstraction cost and dynamic dispatch matter on hot paths.

## Procedure
1. Identify callers and invariants.
2. Model states and errors explicitly.
3. Choose value versus reference semantics deliberately.
4. Minimize public surface and mutability.
5. Use generics/protocols only where multiple implementations or constraints justify them.
6. Define ownership and concurrency expectations.
7. Implement with existing style and availability constraints.
8. Add focused tests for edge cases and API contracts.
9. Measure hot-path changes when performance-sensitive.

## Decision points
Choose structs for independent values; classes for identity/shared lifecycle. Prefer concrete types until polymorphism creates clear value. Prefer typed errors when callers need recovery decisions.

## Common failure patterns
Protocol proliferation, force unwraps, ambiguous optionals, hidden mutation, over-generic APIs, accidental reference sharing, and compatibility breaks.

## Verification
Build all affected targets, run tests, inspect warnings, validate availability and concurrency diagnostics, and exercise representative callers.

## Expected output
A small, explicit Swift API with documented invariants and passing verification evidence.

## Stop conditions
Stop when required compatibility is unknown, unsafe interoperability is involved, or ownership/concurrency behavior cannot be established.