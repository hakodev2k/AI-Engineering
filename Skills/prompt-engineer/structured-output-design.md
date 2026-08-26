# Structured Output Design

## Purpose
Create prompts and contracts that produce reliably parseable outputs without sacrificing semantic correctness.

## When to use
Use for JSON, XML, typed extraction, API handoffs, classification, function arguments, or any model output consumed programmatically.

## Inputs
Consumer schema, field semantics, required/optional rules, nullability, validation constraints, examples, model/runtime structured-output capabilities.

## Context to inspect
Inspect the actual parser, schema version, downstream assumptions, retry logic, and telemetry for parse/semantic failures.

## Core knowledge
Syntactic validity and semantic validity are different. Schema-constrained generation can enforce shape but cannot guarantee truthful values. Optionality, null, omission, empty values, enums, and unknown values require explicit semantics.

## Procedure
1. Start from the consumer contract, not prose output.
2. Minimize fields to those required downstream.
3. Define each field's semantic meaning and allowed absence behavior.
4. Prefer native structured-output/schema enforcement when supported.
5. Specify enum values and unknown/unsupported handling.
6. Avoid asking for commentary outside the structured payload.
7. Provide examples only for genuinely ambiguous semantics.
8. Validate nested, empty, boundary, multilingual, and malformed inputs.
9. Add semantic validators for relationships schema cannot express.
10. Define retry behavior for recoverable failures and terminal behavior for impossible extraction.

## Decision points
Choose strict schemas for machine consumers; use looser text formats for human-only outputs. Prefer omission versus null according to downstream semantics, not convenience. Avoid free-form reasoning fields unless the product genuinely needs an explanation.

## Common failure patterns
Embedding JSON in Markdown fences when raw JSON is required; ambiguous null semantics; giant schemas that reduce reliability; accepting syntactically valid hallucinations; retrying deterministic schema errors indefinitely; changing field names without versioning.

## Verification
Verify parser acceptance, schema validation, semantic invariants, edge cases, and compatibility with the real consumer. Track parse failure and semantic failure separately.

## Expected output
A compact output contract, prompt instructions, validation rules, and representative test cases.

## Stop conditions
Stop if the downstream schema is unavailable or contradictory, sensitive fields lack handling policy, or the requested output cannot be represented safely in the target contract.