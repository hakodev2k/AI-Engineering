# Synthetic Data Rules
## Purpose
Ensure synthetic data improves coverage without disguising artifacts, leakage, or unsupported assumptions.
## Scope
Model-generated, simulated, augmented, and procedurally generated data.
## MUST
- Synthetic data MUST be labeled as synthetic in lineage and dataset metadata.
- Generation method, source dependencies, prompts or parameters, and validation criteria MUST be reproducible where practical.
- Synthetic data MUST be evaluated for realism, diversity, leakage, duplication, and task relevance before use.
## MUST NOT
- Synthetic data MUST NOT be represented as observed real-world evidence.
- Synthetic records MUST NOT be used to hide missing real-world coverage without documenting the gap.
## SHOULD
- Synthetic data SHOULD complement rather than silently replace representative real data when real-world fidelity is required.
## Exceptions
Exceptions require documented purpose, evidence, and risk acceptance.
## Verification
Review generation manifests, provenance, duplicate and leakage checks, distribution comparisons, and downstream ablations.