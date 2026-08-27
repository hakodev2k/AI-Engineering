# Data Model Validation Rules

## Purpose
Prevent malformed or semantically invalid intent from reaching network devices.

## Scope
Schemas, variables, templates, policy inputs, addressing data, enums, references, and cross-field constraints.

## MUST
- External and operator-supplied data MUST be schema validated before use.
- Semantic constraints that schemas cannot express MUST be checked explicitly before rendering.
- References between objects MUST resolve uniquely and required values MUST not be silently defaulted.
- Address, prefix, ASN, VLAN, port, MTU, and protocol values MUST be range and format validated where applicable.
- Validation failures MUST identify the offending object without exposing secrets.

## MUST NOT
- MUST NOT coerce invalid values into plausible network configuration.
- MUST NOT accept unknown enum values or unrecognized fields when they can alter behavior.
- MUST NOT defer predictable input errors until device execution.

## SHOULD
- Models SHOULD encode units and semantic types rather than relying on untyped strings.
- Validation SHOULD run in local development, pull requests, and production pipelines.

## Exceptions
Relaxed validation requires documented compatibility need, bounded field set, evidence, expiry or migration plan, and reviewer approval.

## Verification
Run schema and semantic validators against valid, boundary, malformed, missing-reference, duplicate, and incompatible test fixtures; inspect CI enforcement and error messages.