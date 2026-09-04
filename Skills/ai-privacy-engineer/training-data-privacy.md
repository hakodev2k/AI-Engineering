# Training Data Privacy

## Purpose
Design and review training, fine-tuning, and adaptation datasets so personal data is used deliberately, minimally, traceably, and with controls appropriate to model memorization and reuse risks.

## When to use
Use for pretraining corpora, supervised fine-tuning, preference data, RL data, synthetic-data pipelines seeded from real users, and dataset refreshes.

## Inputs
- Dataset sources and licenses/permissions
- Data schema and samples
- Collection purpose and provenance
- Model architecture and training method
- Retention and deletion requirements
- Evaluation and red-team plans

## Context to inspect
Inspect ingestion jobs, raw buckets, labeling platforms, deduplication, filtering, sampling, dataset snapshots, checkpoints, experiment artifacts, and downstream model distribution.

## Core knowledge
Training introduces persistence risk beyond ordinary storage because information may influence weights and outputs. Privacy controls therefore span source legitimacy, minimization, provenance, access, filtering, memorization evaluation, deletion strategy, and model-release decisions.

## Procedure
1. Inventory dataset sources and provenance.
2. Classify personal and sensitive content.
3. Verify the approved purpose and permitted use for each source.
4. Remove unnecessary identifiers and high-risk fields.
5. Apply deduplication, filtering, and quality checks.
6. Separate raw source data from curated training snapshots.
7. Restrict access and log dataset use.
8. Record lineage from source to training run and checkpoint.
9. Evaluate memorization and extraction risk on representative sensitive examples.
10. Define how deletion requests affect future datasets, retraining, and released models.
11. Review downstream model-sharing implications.
12. Retain evidence for audits and reproducibility.

## Decision points
Exclude data when provenance or permitted use is uncertain. Prefer retraining without problematic records when feasible; use model-level mitigations only when their effectiveness is measured. Treat highly unique or repeated sensitive strings as elevated memorization risk.

## Common failure patterns
- Training from convenient production dumps
- Losing lineage between source and checkpoint
- Assuming redaction after training removes memorization
- Retaining raw datasets longer than needed
- Ignoring labeler exposure to sensitive content
- Treating public availability as automatic permission for any AI use

## Verification
Sample dataset lineage, inspect filtering outputs, confirm access restrictions, run memorization/extraction tests, and verify that removed records do not re-enter future dataset builds.

## Expected output
A privacy-reviewed dataset with provenance, classifications, minimization controls, access rules, lineage, memorization test results, and deletion handling.

## Stop conditions
Escalate if provenance is missing, sensitive data lacks an approved purpose, deletion obligations cannot be operationalized, or extraction testing shows unacceptable memorization.