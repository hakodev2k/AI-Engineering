# Vision Transformers and Foundation Models

## Purpose
Select and adapt pretrained vision or multimodal foundation models without unnecessary cost or loss of task fit.

## When to use
Use when evaluating transfer learning, zero/few-shot baselines, embeddings, or multimodal capabilities.

## Inputs
Task, dataset, candidate checkpoints, licensing terms, latency/memory constraints.

## Preconditions
A measurable baseline and target behavior exist.

## Context to inspect
Pretraining domain, architecture, tokenizer/processor, input size, prompt/template behavior, fine-tuning method, model license.

## Core knowledge
Foundation models offer broad representations but may be poorly calibrated, expensive, domain-mismatched, or operationally constrained.

## Procedure
1. Establish zero/few-shot performance where applicable.
2. Compare embeddings or frozen-backbone baselines.
3. Identify domain gaps by slice.
4. Choose full fine-tuning, adapters, linear probing, or prompting based on data and cost.
5. Track processor and checkpoint versions.
6. Benchmark memory, latency, and throughput.
7. Compare against smaller specialist models.
8. Document licensing and deployment constraints.

## Decision points
Foundation model vs specialist model; frozen vs adapted; multimodal vs vision-only.

## Common failure patterns
Assuming bigger is better, hidden preprocessing changes, prompt leakage, ignoring license terms, no cost comparison.

## Verification
Reproduce task metrics, slice behavior, serving benchmarks, and versioned model provenance.

## Expected output
Model-selection evidence, adaptation strategy, benchmark report, and limitations.

## Stop conditions
Stop when licensing, privacy, compute, or latency constraints make the model unsuitable.