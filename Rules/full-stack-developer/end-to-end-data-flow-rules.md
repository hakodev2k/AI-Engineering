# End-to-End Data Flow Rules

## Purpose
Preserve correctness as data crosses UI, API, domain, storage, and integrations.
## Scope
Input, transformation, persistence, retrieval, and presentation.
## MUST
- Define canonical types, units, time zones, identifiers, and null semantics at boundaries.
- Validate untrusted data before domain use.
- Trace critical transformations end to end.
## MUST NOT
- Silently coerce invalid values or lose precision.
- Assume frontend and backend serialization semantics match without verification.
## SHOULD
- Centralize boundary mappings and test round trips.
## Exceptions
Lossy transformation requires explicit business acceptance and documented impact.
## Verification
Use boundary tests, representative fixtures, schema inspection, and production telemetry.