# Data Type, Charset, and Collation Design

## Purpose
Choose MySQL data representations that preserve semantics, comparison behavior, storage efficiency, and indexability.

## When to use
Use during schema design, internationalization, type migrations, or collation-related defects.

## Inputs
Domain values, ranges, precision, text languages, comparison/sort requirements, interoperability constraints.

## Context to inspect
Server/database/table defaults, existing mixed collations, client encodings, indexes, generated columns, application serialization.

## Core knowledge
Data type choices affect storage and correctness. DECIMAL suits exact decimal arithmetic; temporal types have timezone/range semantics; utf8mb4 is the general Unicode choice. Collations determine equality and ordering and can affect index use.

## Procedure
1. Define semantic domain and valid range for each field.
2. Choose the narrowest type that safely represents future values.
3. Use exact numeric types where rounding is unacceptable.
4. Define temporal storage and timezone policy.
5. Standardize Unicode charset and intentional collation.
6. Check index width and comparison implications.
7. Identify implicit conversions across joins/predicates.
8. Rehearse conversions on production-like data.
9. Validate application round trips and sorting/equality cases.

## Decision points
Use binary/case-sensitive collations only when product semantics require them. Use JSON for genuinely semi-structured attributes, not as a substitute for relational modeling of queried invariants.

## Common failure patterns
FLOAT for money, inconsistent collations, VARCHAR for numeric/time data, naive timestamps, oversized keys, and silent truncation/conversion assumptions.

## Verification
Test boundary values, Unicode edge cases, equality/sort behavior, query plans, and migration warnings/errors.

## Expected output
Explicit type/charset/collation choices with compatibility evidence.

## Stop conditions
Escalate if conversion is lossy, business comparison semantics are ambiguous, or a type change requires destructive migration without approval.