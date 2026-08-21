# Structured Output and Validation

## Purpose
Convert model output into reliable machine-consumable data without trusting probabilistic text as validated state.

## When to use
Use when agent output feeds APIs, databases, workflows, UI state, or tool calls.

## Inputs
Target schema, business invariants, model capabilities, error-handling requirements.

## Context to inspect
Serialization libraries, schema versions, downstream contracts, retries, and security-sensitive fields.

## Core knowledge
Schema conformance is necessary but not sufficient. Semantic and authorization validation must happen in deterministic code before side effects.

## Procedure
1. Define the smallest explicit output schema.
2. Use typed fields, enums, bounds, and required properties.
3. Request native structured output when supported.
4. Parse strictly and reject malformed payloads.
5. Validate business invariants independently.
6. Validate identifiers and permissions against authoritative state.
7. Repair/retry only for recoverable formatting failures.
8. Bound repair attempts.
9. Version schemas compatibly.
10. Test malformed, extra, missing, and adversarial fields.

## Decision points
Use free text for human consumption; structured output for machine decisions. Avoid regex parsing when a schema-capable interface exists.

## Common failure patterns
Trusting valid JSON as valid business data, coercing bad values silently, infinite repair loops, and breaking downstream consumers with schema drift.

## Verification
Contract tests prove valid cases pass and malformed or unauthorized cases fail before side effects.

## Expected output
A versioned schema plus deterministic validation and bounded recovery behavior.

## Stop conditions
Stop when downstream invariants cannot be expressed or checked safely.