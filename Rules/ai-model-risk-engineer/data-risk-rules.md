# Data Risk Rules

## Purpose
Control model risks arising from training, tuning, evaluation, retrieval, and operational data.

## Scope
Applies to datasets, labels, prompts, embeddings, feedback data, synthetic data, and data derived from users or third parties.

## MUST
- Material datasets MUST have documented provenance, permitted use, sensitivity classification, and quality limitations.
- Data handling MUST comply with applicable privacy, contractual, licensing, retention, and access requirements.
- High-impact models MUST assess whether material populations or scenarios are missing or systematically underrepresented.
- Data transformations that affect labels, semantics, or population composition MUST be reviewable and reproducible.
- Sensitive data access MUST follow least privilege and be auditable.

## MUST NOT
- Protected, confidential, or restricted data MUST NOT be repurposed for model development without authorization.
- Synthetic data MUST NOT be assumed safe, representative, or non-sensitive without validation.

## SHOULD
- Dataset changes SHOULD be versioned and linked to model evaluation results.
- Teams SHOULD monitor for drift in operational data distributions when it can change model risk.

## Exceptions
Any exception must document data category, purpose, legal or policy basis, controls, duration, residual risk, and approver.

## Verification
Inspect dataset records, access controls, lineage, licenses or usage terms, transformation code, and sampling reports. Confirm restricted-data controls through configuration and audit evidence.