# Evaluation Dataset Governance Rules

## Purpose
Protect the validity, legality, privacy, and maintainability of datasets used to evaluate AI systems.

## Scope
Applies to curated test sets, production-derived samples, synthetic datasets, red-team corpora, human-labeled examples, and benchmark imports.

## MUST
- Every evaluation dataset MUST record provenance, intended use, ownership, version, and known limitations.
- Sensitive or production-derived data MUST be handled according to applicable privacy, retention, and access requirements.
- Train, development, tuning, and final evaluation sets MUST be separated when score validity depends on independence.
- Dataset changes that can affect reported metrics MUST create a new version and MUST be documented.
- Labels and reference answers MUST be reviewable and traceable to their source or annotation process.

## MUST NOT
- MUST NOT place secrets, credentials, unnecessary personal data, or restricted data into evaluation corpora.
- MUST NOT reuse hidden holdout items for iterative prompt or model tuning without reclassifying the set.
- MUST NOT silently merge datasets with incompatible licenses, consent conditions, or label definitions.

## SHOULD
- Datasets SHOULD include metadata supporting subgroup, source, difficulty, and failure-mode analysis.
- Stale or low-value examples SHOULD be retired through an auditable process rather than silently deleted.

## Exceptions
Exceptions require documented legal or policy basis, data-minimization rationale, risk controls, and accountable approval.

## Verification
Inspect dataset cards or equivalent metadata, access controls, version history, lineage, retention configuration, split logic, and a sample of labels. Confirm evaluation artifacts reference immutable dataset versions.