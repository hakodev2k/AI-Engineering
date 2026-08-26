# Data Governance for AI

## Purpose
Govern data used for training, tuning, retrieval, evaluation, logging, and feedback so AI systems have lawful, traceable, fit-for-purpose inputs.

## When to use
Use for new datasets, new AI purposes, data-source changes, RAG corpora, feedback loops, or data-related incidents.

## Inputs
Data lineage, source terms, consent/legal basis, classifications, retention, quality metrics, licenses, access controls, dataset documentation.

## Procedure
1. Map data flows and purposes by lifecycle stage.
2. Verify provenance, rights, permissions, and restrictions.
3. Classify sensitive and regulated data.
4. Assess representativeness, quality, contamination, and leakage risks.
5. Apply minimization and purpose limitation.
6. Define access, retention, deletion, and lineage controls.
7. Separate evaluation data where contamination matters.
8. Govern feedback and human-labeling pipelines.
9. Record dataset versions and transformations.
10. Monitor drift, rights changes, and deletion obligations.

## Decision points
Do not use data merely because technically accessible. Synthetic or de-identified data can reduce exposure but requires validation against utility and re-identification risk.

## Common failure patterns
Unknown provenance, license mismatch, sensitive logs, benchmark contamination, untracked copies, deletion that does not propagate.

## Verification
Trace sampled records from source through transformations to model/system use and deletion path.

## Expected output
Governed data map, dataset records, controls, approvals, and evidence.

## Stop conditions
Stop on unresolved rights, provenance, consent, or prohibited-data issues.