# Structured Output Contract Testing

## Purpose
Verify that AI-generated structured outputs satisfy schemas, invariants, downstream assumptions, and backward-compatibility requirements.

## When to use
Use for JSON, XML, typed function arguments, extraction pipelines, generated configuration, database-bound objects, and machine-consumed responses.

## Inputs
Schema, semantic invariants, sample inputs, downstream contracts, failure policy, model configuration, and versioning rules.

## Preconditions
The consumer contract and invalid-output behavior are explicit.

## Context to inspect
Inspect prompts, schema enforcement, parser behavior, retry/repair logic, validation code, defaulting, and downstream side effects.

## Core knowledge
Syntactic validity is weaker than semantic validity. A response can parse correctly yet violate ranges, cross-field constraints, identifiers, enum meaning, security rules, or business invariants.

## Procedure
1. Enumerate schema and semantic constraints.
2. Build valid, ambiguous, edge, and adversarial inputs.
3. Assert parseability and exact schema conformance.
4. Validate required fields, types, enums, bounds, and cross-field rules.
5. Test extra fields and unsupported versions.
6. Test escaping, Unicode, large values, nulls, and malformed source inputs.
7. Simulate model truncation and partial output.
8. Verify repair/retry behavior is bounded and observable.
9. Test downstream consumers against representative valid and invalid responses.
10. Add discovered failures to regression cases.

## Decision points
Prefer constrained decoding or provider-native schema enforcement when available, but keep semantic validation. Reject rather than silently coerce high-impact invalid values.

## Common failure patterns
Checking only JSON parse success, permissive parsers hiding model errors, endless repair loops, unvalidated identifiers, and incompatible schema changes.

## Verification
Confirm all hard contract tests pass, invalid outputs fail safely, and downstream consumers are protected from malformed or semantically invalid data.

## Expected output
A contract test suite and report covering syntax, semantics, compatibility, recovery, and downstream behavior.

## Stop conditions
Stop when the authoritative schema or downstream invariants are unknown.