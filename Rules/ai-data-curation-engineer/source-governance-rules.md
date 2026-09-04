# Source Governance Rules
## Purpose
Ensure training and evaluation data comes from traceable, authorized, fit-for-purpose sources.
## Scope
Datasets, corpora, synthetic data, vendor data, public data, and internal sources used for AI development.
## MUST
- Every source MUST have documented ownership, acquisition method, intended use, license or permission basis, and refresh expectations.
- Source suitability MUST be assessed for quality, representativeness, legal constraints, privacy, security, and downstream model risk.
- Provenance MUST be preserved from source through derived datasets.
## MUST NOT
- Data MUST NOT be ingested when usage rights or ownership are materially uncertain.
- Source metadata MUST NOT be discarded during transformation.
## SHOULD
- Prefer authoritative and stable sources over scraped or weakly governed alternatives.
## Exceptions
Exceptions require documented rationale, risk, evidence, alternatives considered, and accountable approval.
## Verification
Review source registers, lineage metadata, contracts or licenses, data inventories, and ingestion logs.