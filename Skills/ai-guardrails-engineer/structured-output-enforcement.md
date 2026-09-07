# Structured Output Enforcement

## Purpose
Constrain model output to machine-verifiable contracts before downstream effects.

## When to use
Use for tool arguments, routing, classification, extraction, configuration, automation.

## Inputs
Schema, invariants, downstream contract, interface, error policy, edge cases.

## Context to inspect
Inspect parsing, coercion, defaults, assumptions, retries, rejection logging.

## Core knowledge
Schema-valid is not semantically valid. Enforce types, ranges, enums, authorization, referential/business invariants.

## Procedure
1. Define minimal schema.
2. Make dangerous fields explicit.
3. Constrain values.
4. Reject unknowns where appropriate.
5. Validate semantic/authorization invariants.
6. Bound regeneration.
7. Prevent partial execution.
8. Log safe reasons.
9. Test malformed/adversarial output.
10. Version contracts.

## Decision points
Prefer deterministic mapping when possible.

## Common failure patterns
JSON-as-validation, coercion, infinite repair, permissive fields, partial execution.

## Verification
Fuzz and prove safe rejection.

## Expected output
Schemas, validators, failure policy, tests.

## Stop conditions
Escalate ambiguous free-form privileged interfaces.