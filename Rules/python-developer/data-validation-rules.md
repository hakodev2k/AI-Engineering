# Data Validation Rules
## Purpose
Prevent malformed or untrusted data from corrupting behavior.
## Scope
HTTP, messages, files, CLI input, configuration, and external data.
## MUST
- Untrusted data MUST be validated before domain logic relies on it.
- Validation MUST define required fields, ranges, formats, and unknown-field policy where relevant.
- Validation failures MUST produce safe, actionable errors without leaking sensitive details.
## MUST NOT
- MUST NOT rely on type hints alone for untrusted runtime data.
- MUST NOT coerce ambiguous values silently when semantics could change.
## SHOULD
- Validate at boundaries and keep domain invariants centralized.
## Exceptions
Trusted internal paths require documented trust assumptions.
## Verification
Boundary tests, malformed-input tests, and schema/config inspection.