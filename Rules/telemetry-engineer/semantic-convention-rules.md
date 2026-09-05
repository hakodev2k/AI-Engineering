# Semantic Convention Rules

## Purpose
Keep telemetry names and meanings consistent across systems so analysis remains reliable.

## Scope
Metric names, log fields, trace attributes, event names, units, status values, and resource metadata.

## MUST
- Shared concepts MUST use consistent names, types, units, and value semantics across producers.
- Units MUST be explicit and normalized where aggregation or comparison occurs.
- Enumerated values used by automation MUST have documented allowed values.
- Deviations from adopted conventions MUST be documented with a concrete interoperability reason.

## MUST NOT
- MUST NOT create synonymous fields for the same concept without migration intent.
- MUST NOT encode multiple meanings into one field based on undocumented context.
- MUST NOT change units while retaining the same field name.

## SHOULD
- Reuse industry or protocol semantic conventions before inventing local ones.

## Exceptions
Require documented incompatibility, alternative considered, downstream impact, and verification plan.

## Verification
Inspect schemas, SDK constants, emitted samples, linting rules, and cross-service queries.