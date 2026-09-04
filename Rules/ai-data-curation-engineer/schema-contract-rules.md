# Schema Contract Rules
## Purpose
Protect dataset consumers from undocumented structural and semantic changes.
## Scope
Schemas, field definitions, types, enumerations, units, nullability, and semantic contracts.
## MUST
- Dataset schemas MUST be versioned and documented with field semantics.
- Breaking schema changes MUST be identified before release and communicated to affected consumers.
- Units, encodings, label meanings, and null semantics MUST be explicit.
## MUST NOT
- Field meaning MUST NOT change while retaining the same contract without versioning.
- Unknown or malformed fields MUST NOT be silently coerced when coercion can alter meaning.
## SHOULD
- Compatibility checks SHOULD run automatically in curation pipelines.
## Exceptions
Exceptions require migration guidance, impact evidence, and accountable approval.
## Verification
Inspect schema registries, contracts, compatibility tests, diffs, and downstream validation results.