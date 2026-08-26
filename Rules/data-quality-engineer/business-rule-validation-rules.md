# Business Rule Validation Rules
## Purpose
Encode domain invariants as verifiable data checks.
## Scope
Ranges, state transitions, cross-field logic, eligibility, and domain constraints.
## MUST
- Critical business invariants MUST be expressed unambiguously with owner-approved semantics.
- Validation MUST account for effective dates and rule-version changes.
- Failed invariants MUST preserve enough context for investigation without exposing restricted data.
## MUST NOT
- MUST NOT invent domain thresholds without accountable owner confirmation.
- MUST NOT hard-code temporary policy assumptions as permanent truth.
## SHOULD
- Rules SHOULD be executable and traceable to requirements.
## Exceptions
Unautomatable rules require documented manual evidence and review cadence.
## Verification
Trace rules to definitions, execute positive/negative cases, and review exception samples.