# Structured Output Engineering

## Purpose
Produce machine-consumable model responses that downstream code can validate and process safely.

## When to use
Use for extraction, classification, routing, API payloads, tool arguments, or any workflow where prose parsing is unsafe.

## Inputs
Target schema, examples, validation rules, downstream contract, retry budget, model capabilities.

## Preconditions
Define the schema independently from the prompt and identify required versus optional fields.

## Context to inspect
Provider structured-output features, parser behavior, nullability, enum handling, size limits, retry logic, consumer assumptions.

## Core knowledge
Schema-constrained generation reduces syntax failures but does not guarantee semantic correctness. Validate both shape and business rules. Keep schemas minimal and explicit.

## Procedure
1. Define a typed schema with stable field names.
2. Minimize ambiguity in types, enums, nullability, and nesting.
3. Use provider-native structured output when available.
4. Explain semantic rules in the prompt.
5. Validate every response against schema and domain rules.
6. Retry only recoverable failures with bounded attempts.
7. Record invalid outputs and add them to regression tests.
8. Version schema changes and preserve backward compatibility where required.

## Decision points
Prefer enums over free text for closed categories. Split large schemas when independent stages can be validated separately. Use deterministic code for derived fields.

## Common failure patterns
Parsing Markdown as JSON, accepting syntactically valid but impossible values, giant nested schemas, silent coercion, infinite retries, and breaking downstream consumers without versioning.

## Verification
Run schema and semantic validation across representative and adversarial cases; confirm consumers handle missing/invalid data safely.

## Expected output
A versioned structured contract with validation, bounded recovery, and regression coverage.

## Stop conditions
Stop when the output contract is undefined or downstream code cannot safely reject invalid data.