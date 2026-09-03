# Multimodal Fine-Tuning

## Purpose
Adapt pretrained multimodal models to domain-specific tasks while preserving general capabilities, controlling overfitting, and minimizing unnecessary compute.

## When to use
Use when prompting or retrieval cannot meet domain accuracy, terminology, grounding, style, or structured-output requirements.

## Inputs
Pretrained model, labeled or preference data, target task, evaluation suite, compute budget, deployment constraints.

## Preconditions
Demonstrate a measurable baseline gap that fine-tuning is intended to close and verify training-data rights.

## Context to inspect
Inspect adapter support, trainable modules, processor versions, modality distribution, label quality, class imbalance, sequence lengths, and target serving stack.

## Core knowledge
Parameter-efficient methods reduce cost and forgetting but may underfit deep cross-modal changes. Full fine-tuning offers flexibility at greater compute and regression risk. Domain adaptation must be evaluated on both target and retained general capabilities.

## Procedure
1. Define the exact baseline failure classes.
2. Curate representative multimodal training examples.
3. Separate train, validation, and untouched regression sets.
4. Select full, partial, or parameter-efficient tuning.
5. Decide which modality encoders and fusion layers remain frozen.
6. Tune learning rates by module sensitivity.
7. Track per-modality and cross-modal metrics.
8. Stop on validation degradation rather than training loss alone.
9. Evaluate catastrophic forgetting and safety regressions.
10. Test inference with the production processor and quantization path.
11. Compare gain against prompting, retrieval, and reranking alternatives.
12. Version adapters/checkpoints with dataset and processor metadata.

## Decision points
Prefer adapters when deployment needs multiple domains or frequent updates. Use deeper fine-tuning only when evidence shows shallow adaptation cannot correct the failure mode.

## Common failure patterns
Training on synthetic artifacts only; leaking near-duplicates into validation; changing preprocessing between training and serving; tuning one modality while degrading another; selecting checkpoints by training loss.

## Verification
Re-run the complete regression suite, target-domain holdout, safety checks, and serving benchmarks. Verify the production artifact reproduces offline gains.

## Expected output
A versioned fine-tuned model or adapter with dataset lineage, regression evidence, deployment compatibility, and rollback criteria.

## Stop conditions
Stop when target gains disappear on untouched data, safety/general capability regressions are material, or deployment cannot reproduce the training processor/model combination.