# Data Mapping and Transformation

## Purpose
Transform data between systems without silently corrupting meaning, precision, identifiers, nullability, units, timestamps, or ownership semantics.

## When to use
Use whenever a workflow translates records, aggregates fields, enriches payloads, normalizes formats, or bridges incompatible schemas.

## Inputs
Source and target schemas, sample records, field definitions, business rules, locale/timezone rules, identifier semantics, and data-quality expectations.

## Context to inspect
Inspect production-like samples, null and empty behavior, enums, numeric precision, dates, nested arrays, encoding, field ownership, and prior transformation defects.

## Core knowledge
Syntactic compatibility is not semantic compatibility. A field named `status` can encode different state models across systems. Transformations should be explicit, deterministic where possible, and observable when data is rejected or defaulted.

## Procedure
1. Identify authoritative meaning for every source and target field.
2. Build an explicit field-level mapping.
3. Define type conversions and precision requirements.
4. Define null, empty, missing, and default semantics separately.
5. Normalize timezone, locale, currency, units, and encoding explicitly.
6. Map enums using documented business meaning rather than ordinal position.
7. Preserve stable identifiers and provenance.
8. Validate nested collections and cardinality assumptions.
9. Define reject/quarantine behavior for unmappable data.
10. Add transformation tests for boundaries and representative anomalies.
11. Version mappings when target contracts change.

## Decision points
Reject invalid data when silent coercion could change business meaning. Use defaults only when they are contractually safe and observable. Enrich from another source only when its freshness and ownership are understood.

## Common failure patterns
Implicit timezone conversion, truncating decimals, conflating null and empty, fragile string parsing, positional enum mapping, and silently dropping unknown fields.

## Verification
Run golden-record tests, boundary-value tests, round-trip checks where meaningful, and reconciliation against source and target counts and key fields.

## Expected output
A documented, tested transformation contract with explicit semantics, validation, rejection handling, and provenance.

## Stop conditions
Stop when field meaning is ambiguous, source and target business semantics conflict, or required precision cannot be preserved.