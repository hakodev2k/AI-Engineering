# Configuration Schema and Validation

## Purpose
Prevent malformed, ambiguous, or semantically invalid configuration from reaching consumers.

## Scope
Configuration formats, schemas, defaults, constraints, parsing, and validation pipelines.

## MUST
- Machine-consumed configuration MUST be validated before activation.
- Required fields, types, ranges, allowed values, and cross-field invariants MUST be explicit where enforceable.
- Validation failures MUST identify the invalid setting without exposing secrets.
- Schema changes MUST be versioned or compatibility-assessed before rollout.
- Unknown fields MUST have an intentional policy: reject, warn, or explicitly tolerate.

## MUST NOT
- Validation MUST NOT silently coerce unsafe or ambiguous values.
- Invalid configuration MUST NOT be activated merely because parsing succeeded.
- Defaults MUST NOT conceal absence of a value whose explicit selection is safety-critical.

## SHOULD
- Validate as early as possible in CI and again at activation boundaries.
- Prefer schemas that can drive editor, linting, and automated checks.

## Exceptions
Legacy formats without formal schemas require documented validation logic, migration intent, and equivalent test coverage.

## Verification
Run schema validators and semantic tests against valid, boundary, malformed, missing, and unknown-field cases. Inspect CI gates and activation logs to confirm invalid configuration is rejected before it affects service behavior.