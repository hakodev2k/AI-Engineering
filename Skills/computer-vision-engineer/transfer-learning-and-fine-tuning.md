# Transfer Learning and Fine-Tuning

## Purpose
Adapt pretrained vision models efficiently while controlling catastrophic forgetting, domain mismatch, optimization instability, and unnecessary compute.

## When to use
Use when labeled target data is limited, pretrained models exist, a domain shift must be addressed, or full training from scratch is not justified.

## Inputs
Pretrained checkpoint, target dataset, baseline metrics, compute budget, deployment constraints, and source-domain information when available.

## Context to inspect
Inspect preprocessing assumptions, label-space mismatch, input resolution, normalization, tokenizer/text encoder for multimodal models, frozen layers, optimizer groups, and checkpoint license.

## Core knowledge
Transfer gains depend on representation alignment. Linear probing, partial unfreezing, discriminative learning rates, adapters/LoRA where supported, and full fine-tuning trade flexibility against stability and cost.

## Procedure
1. Validate checkpoint provenance and preprocessing contract.
2. Benchmark zero-shot or frozen-feature performance where applicable.
3. Establish a linear-probe or head-only baseline.
4. Inspect which errors indicate representation versus classifier limitations.
5. Unfreeze progressively rather than assuming full fine-tuning.
6. Configure lower learning rates for pretrained parameters when appropriate.
7. Monitor train/validation divergence and forgetting.
8. Compare augmentation and regularization under fixed evaluation conditions.
9. Evaluate critical production slices after each strategy.
10. Measure training cost and serving impact.
11. Preserve the base checkpoint and exact fine-tuning configuration.
12. Select the least invasive strategy meeting target quality.

## Decision points
Use frozen features when target data is small and domain alignment is strong. Use deeper unfreezing for larger domain shifts. Train from scratch only when data scale, domain uniqueness, or architectural requirements justify it.

## Common failure patterns
Wrong normalization for the pretrained model, excessively high learning rates, evaluating only final accuracy, overfitting small datasets, and comparing fine-tuning strategies with different augmentations or data splits.

## Verification
Verify reproducibility across seeds, improvement over frozen and scratch baselines, slice-level performance, retained exportability, and documented checkpoint lineage.

## Expected output
A selected fine-tuning strategy with configuration, evidence, compute cost, limitations, and reproducible artifacts.

## Stop conditions
Stop if checkpoint licensing/provenance is invalid, preprocessing cannot be reconciled, or available data cannot support a meaningful comparison.