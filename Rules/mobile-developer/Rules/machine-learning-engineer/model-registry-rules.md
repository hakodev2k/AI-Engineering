# Model Registry Rules
## Purpose
Control model identity, provenance, lifecycle, and promotion.
## Scope
Candidate, staged, production, deprecated, and archived artifacts.
## MUST
- Register promoted artifacts with immutable identity, provenance, metrics, owner, status, and approval evidence.
- Distinguish candidate, approved, production, and retired states explicitly.
- Make rollback targets identifiable before deployment.
## MUST NOT
- Deploy an unregistered or provenance-unknown artifact to production.
- Mutate an artifact under an existing version identifier.
## SHOULD
- Automate promotion gates and lineage capture.
## Exceptions
Emergency rollback may use a previously approved artifact with incident documentation.
## Verification
Inspect registry metadata, artifact hashes, stage transitions, and deployment references.