# Directory and Identity Data
## Purpose
Preserve correctness and confidentiality of identity attributes.
## Scope
Directories, profiles, claims, groups, and identity attributes.
## MUST
- Security-relevant attributes MUST have an authoritative source and controlled update path.
- Attribute mappings MUST define normalization, uniqueness, null behavior, and conflict handling.
- Sensitive identity data MUST be classified and access-controlled.
## MUST NOT
- Mutable display attributes MUST NOT be used as stable security identifiers.
- Untrusted attributes MUST NOT directly grant privilege without validation.
## SHOULD
- Minimize replicated identity data and retain only what integrations require.
## Exceptions
Document compatibility need, data risk, reconciliation, and approval.
## Verification
Schema review, mapping tests, uniqueness checks, access inspection, and reconciliation reports.