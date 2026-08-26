# Training Data Poisoning

## Purpose
Assess whether malicious or corrupted training data can create unsafe or attacker-controlled behavior.

## Scope
Pretraining additions, fine-tuning, preference data, feedback pipelines, synthetic data, and continual-learning inputs.

## MUST
- Trace tested poisoning paths to actual ingestion and training controls.
- Evaluate targeted behavior, persistence, collateral degradation, and detectability.
- Use controlled datasets and isolated training runs for active poisoning experiments.

## MUST NOT
- Modify production training corpora without explicit authorization and rollback controls.
- Treat ordinary data quality errors as adversarial poisoning without evidence of an attack path.

## SHOULD
Test provenance, deduplication, anomaly detection, review, and dataset versioning controls.

## Exceptions
Any experiment touching shared datasets requires owner approval and a restoration plan.

## Verification
Inspect dataset lineage, diffs, training configuration, evaluation deltas, and restoration evidence.