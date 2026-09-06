# Structured Context Rules

## Purpose
Represent context in stable structures that preserve meaning and reduce ambiguity.

## Scope
JSON-like records, tagged sections, tables, field ordering, delimiters, and serialization.

## MUST
- Structured context MUST use explicit field names for source, content, provenance, and role when those properties affect interpretation.
- Serialization MUST be deterministic for equivalent inputs.
- Delimiters MUST prevent content from being confused with metadata.
- Required fields MUST be validated before model invocation.
- Structured values MUST preserve data types where practical.

## MUST NOT
- MUST NOT rely on whitespace alone to communicate critical boundaries.
- MUST NOT silently drop required metadata during serialization.
- MUST NOT encode conflicting meanings in the same field.

## SHOULD
- Prefer compact schemas that remain human-inspectable.
- Use escaping rules consistently for nested content.

## Exceptions
Exceptions require documented compatibility needs and verification.

## Verification
Inspect serialized snapshots, schema checks, parser tests, and round-trip tests.