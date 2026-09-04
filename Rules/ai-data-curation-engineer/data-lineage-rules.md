# Data Lineage Rules
## Purpose
Preserve traceability across collection, transformation, filtering, labeling, sampling, and release.
## Scope
All curated datasets and intermediate artifacts used in AI systems.
## MUST
- Every released dataset MUST be traceable to source datasets and transformation steps.
- Transformations MUST record code or configuration version, parameters, timestamps, and responsible process or owner.
- Derived subsets MUST retain stable identifiers sufficient to reproduce membership where practical.
## MUST NOT
- Lineage MUST NOT depend solely on undocumented manual knowledge.
- Intermediate transformations MUST NOT silently overwrite prior states when reproducibility matters.
## SHOULD
- Lineage SHOULD be machine-readable and queryable.
## Exceptions
Exceptions require rationale, residual risk, reconstruction method, and approval when traceability is weakened.
## Verification
Inspect lineage graphs, manifests, version-control references, pipeline metadata, and reproducibility tests.