# AI Data Governance Rules

## Purpose
Ensure data used by AI systems is authorized, suitable, traceable, and controlled throughout collection, preparation, training, evaluation, inference, and retention.

## Scope
Applies to training data, fine-tuning data, retrieval corpora, prompts, inference inputs, evaluation sets, feedback data, derived features, and generated outputs retained for reuse.

## MUST
- Every material dataset MUST have a documented source, owner, permitted purpose, classification, retention expectation, and relevant quality limitations.
- Data use MUST be consistent with approved purpose, contractual restrictions, privacy obligations, and security classification.
- Training, evaluation, and production data boundaries MUST be defined to prevent leakage and invalid evaluation.
- Data lineage MUST be sufficient to trace material outputs or model behavior back to authoritative sources or data-processing stages where practical.
- High-risk datasets MUST have documented representativeness, known gaps, and bias or quality limitations relevant to the use case.
- Data deletion, correction, and retention obligations MUST propagate to downstream stores and workflows where required.

## MUST NOT
- MUST NOT ingest data merely because it is technically accessible.
- MUST NOT use production secrets, authentication tokens, or restricted credentials as model inputs or training material.
- MUST NOT mix evaluation labels into training data in ways that invalidate reported performance.
- MUST NOT retain sensitive prompts or outputs indefinitely without an approved purpose and retention rule.

## SHOULD
- Data minimization SHOULD be applied at each lifecycle stage.
- High-risk pipelines SHOULD use reproducible versioned datasets and automated quality checks.
- Synthetic data SHOULD be labeled and evaluated for distortions before it is treated as representative evidence.

## Exceptions
Exceptions MUST document purpose, data categories, legal or policy basis, risk, controls, retention, and approval. Missing data provenance for high-risk use MUST be escalated rather than silently accepted.

## Verification
Inspect data catalogs, lineage, dataset versions, pipeline configuration, access controls, retention jobs, deletion evidence, evaluation splits, and sampled records. Confirm actual data flows match approved declarations.