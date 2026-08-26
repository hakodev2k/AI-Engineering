# Source Onboarding Rules
## Purpose
Establish quality controls before new sources become trusted dependencies.
## Scope
Source assessment, contracts, profiling, ownership, security, lineage, and acceptance.
## MUST
- New critical sources MUST identify owner, delivery semantics, schema, keys, expected volumes, freshness, failure modes, and data classification before trusted use.
- Baseline profiling and representative failure tests MUST precede production trust designation.
- Source assumptions MUST be encoded as contracts or monitored checks where practical.
## MUST NOT
- MUST NOT promote an undocumented external feed directly into trusted downstream products.
- MUST NOT assume source reliability from a short successful observation period.
## SHOULD
- Onboarding SHOULD include replay, late-data, duplicate, and outage scenarios.
## Exceptions
Expedited onboarding requires bounded scope, explicit risk acceptance, and enhanced monitoring.
## Verification
Review onboarding evidence, contracts, profiles, lineage, security classification, tests, and acceptance approval.