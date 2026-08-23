# Structured Output Rules

## Purpose
Ensure machine-consumed model outputs are predictable, valid, and safely handled.

## Scope
JSON, XML, schemas, function arguments, typed objects, and other structured response formats.

## MUST
- Production structured outputs MUST have an explicit schema or equivalent contract.
- Required fields, allowed values, nullability, and error behavior MUST be defined.
- Consumers MUST validate model output before using it for side effects or persistence.
- Schema changes MUST be versioned or coordinated with dependent consumers.

## MUST NOT
- MUST NOT parse critical outputs with brittle string matching when a structured contract is available.
- MUST NOT assume syntactic validity implies semantic correctness.
- MUST NOT execute model-produced commands or arguments without authorization and validation.

## SHOULD
- Prefer platform-supported structured output mechanisms over prose-only formatting instructions.
- Validation failures SHOULD trigger bounded recovery rather than uncontrolled retries.

## Exceptions
Human-only exploratory outputs may use lightweight formatting when no machine dependency exists.

## Verification
Run schema validation tests, malformed-output tests, backward-compatibility tests, and side-effect safety checks.