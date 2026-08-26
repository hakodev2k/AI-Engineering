# Metadata and Documentation Rules
## Purpose
Keep quality semantics discoverable, current, and operationally useful.
## Scope
Catalogs, definitions, owners, classifications, limitations, and runbooks.
## MUST
- Critical datasets MUST document purpose, grain, keys, owner, source, freshness, major quality expectations, and known limitations.
- Documentation changes MUST accompany material semantic or operational changes.
- Known quality limitations MUST state affected scope and consumer implications.
## MUST NOT
- MUST NOT label data trusted when documented unresolved defects violate its acceptance criteria.
- MUST NOT rely on tribal knowledge for critical recovery or validation procedures.
## SHOULD
- Metadata SHOULD be generated from executable definitions where practical to reduce drift.
## Exceptions
Temporary undocumented states require an owner and explicit remediation deadline.
## Verification
Compare documentation with schemas, contracts, lineage, monitoring, runbooks, and current incident state.