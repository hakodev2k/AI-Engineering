# Data Mapping Rules

## Purpose
Ensure data transformations preserve meaning, integrity, and traceability across systems.

## Scope
Applies to field mapping, canonical models, enrichment, normalization, and transformation logic.

## MUST
- Every mapped field MUST have documented source, destination, transformation, datatype, and ownership semantics.
- Lossy transformations MUST be identified and approved when they can affect business or compliance outcomes.
- Enumerations, identifiers, currencies, units, locale, date, and time-zone conversions MUST be explicit.
- Required destination fields MUST have deterministic population or rejection behavior.
- Transformation logic MUST be testable independently from transport logic.

## MUST NOT
- MUST NOT invent default business values merely to satisfy a destination schema.
- MUST NOT truncate or coerce data silently.
- MUST NOT merge distinct business concepts because their labels appear similar.

## SHOULD
- Mapping specifications SHOULD be version controlled.
- Reusable canonical mappings SHOULD be preferred when they reduce semantic drift without obscuring source-specific meaning.

## Exceptions
Document the transformation compromise, data impact, consumers, mitigation, and approval.

## Verification
Review mapping specifications, transformation code, representative fixtures, boundary-value tests, rejected-record behavior, and reconciliation results.