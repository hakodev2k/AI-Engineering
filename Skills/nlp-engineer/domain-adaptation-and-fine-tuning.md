# Domain Adaptation and Fine-Tuning

## Purpose
Adapt language models to domain vocabulary, style, labels, and behaviors while controlling overfitting, regression, cost, and deployment complexity.

## When to use
Use when prompting, retrieval, or an off-the-shelf model fails consistently on domain-specific behavior and sufficient representative data exists.

## Inputs
Baseline model, domain corpus, labeled or preference data, target metrics, compute budget, deployment constraints.

## Preconditions
A stable evaluation set demonstrates a repeatable baseline gap worth adapting.

## Context to inspect
Data provenance, class/domain distribution, model license, tokenizer coverage, training code, previous checkpoints, inference stack.

## Core knowledge
Fine-tuning changes model behavior globally and can trade general capability for domain fit. Parameter-efficient methods reduce storage/compute but do not remove data quality, catastrophic forgetting, or evaluation requirements.

## Procedure
1. Quantify baseline errors and confirm adaptation is the right lever.
2. Clean, deduplicate, and split domain data to prevent leakage.
3. Select full fine-tuning, adapters/LoRA, continued pretraining, or task-specific heads.
4. Establish immutable baseline and training configuration.
5. Train with checkpointing and controlled seeds.
6. Evaluate target task, general regression, safety, and language slices.
7. Inspect memorization and sensitive-data exposure risks.
8. Measure inference latency/memory changes.
9. Select checkpoint using agreed metrics, not training loss alone.
10. Version model, data, code, and hyperparameters.

## Decision points
Use continued pretraining for broad domain language adaptation; supervised fine-tuning for explicit task behavior; PEFT when operational efficiency matters and quality is sufficient.

## Common failure patterns
Fine-tuning before proving a baseline gap, test leakage, training on synthetic data without audit, selecting by loss only, and shipping without regression evaluation.

## Verification
Target metrics improve significantly, critical regressions remain within bounds, training is reproducible, and serving constraints pass.

## Expected output
Versioned adapted model, training manifest, evaluation comparison, regression report, and deployment notes.

## Stop conditions
Stop if data rights are unclear, improvements are not reproducible, or safety/general regressions exceed accepted limits.