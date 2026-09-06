# API Schema Governance

## Purpose
Maintain consistent, evolvable API schemas across independently owned services without creating a bureaucratic bottleneck.

## When to use
Use when defining schema standards, introducing OpenAPI/AsyncAPI/GraphQL governance, or correcting ecosystem inconsistency.

## Inputs
Existing schemas, style conventions, consumer tooling, compatibility policy, ownership model.

## Context to inspect
Inspect naming, types, error structures, pagination, security definitions, linting, code generation, and exception patterns.

## Core knowledge
Governance should automate objective rules and reserve human review for semantic decisions. Standards must distinguish mandatory interoperability rules from preferences.

## Procedure
1. Inventory recurring schema patterns and inconsistencies.
2. Define a minimal mandatory style guide.
3. Standardize common primitives and error semantics.
4. Encode machine-checkable rules in linting.
5. Add compatibility checks to CI.
6. Define exception and waiver process with expiration/review.
7. Validate generated clients and documentation.
8. Establish ownership for shared schema components.
9. Roll out rules progressively to avoid blocking legacy APIs unnecessarily.
10. Measure violations and developer friction.

## Decision points
Centralize truly cross-platform primitives; avoid giant shared schemas that couple domains. Prefer automated checks over manual policing.

## Common failure patterns
Style guides nobody enforces, excessive rules, shared models creating coupling, and lint rules that ignore semantic correctness.

## Verification
Run linting and compatibility checks across representative APIs and validate generated artifacts.

## Expected output
A lightweight, automated schema governance system with clear exception handling.

## Stop conditions
Stop if proposed standards conflict with required external contracts or cannot be adopted without an explicit migration strategy.