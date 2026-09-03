# Nullability Rules

## Purpose
Make absence semantics explicit and prevent consumers from guessing what missing data means.

## Scope
Applies to nullable fields, optional attributes, sparse records, missing columns, and sentinel values.

## MUST
- Each nullable or optional field MUST define why absence can occur and how consumers should interpret it.
- Producers MUST distinguish unknown, not applicable, not yet available, and intentionally redacted states when those meanings affect behavior.
- Changes from optional to required or required to optional MUST be compatibility-reviewed.

## MUST NOT
- Sentinel values such as empty strings, zero, or arbitrary dates MUST NOT substitute for null without an explicit contract definition.
- Consumers MUST NOT be forced to infer absence semantics from implementation details.

## SHOULD
- Prefer explicit state fields when multiple absence reasons are operationally important.
- Validation SHOULD detect impossible combinations of nullability and related state fields.

## Exceptions
Exceptions require documented semantics, affected-consumer analysis, and verification that the representation cannot be confused with valid data.

## Verification
Inspect schema constraints, examples, producer validation, consumer tests, and sampled production records for documented absence behavior.