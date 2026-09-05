# Knowledge Distillation

## Purpose
Transfer useful behavior from a larger teacher into a smaller or cheaper student model.

## When to use
When target quality cannot be met by an off-the-shelf smaller model and training data/compute are available.

## Inputs
Teacher, student candidates, training data, evaluation suites, deployment constraints, baseline cost/performance.

## Preconditions
Define legal/data-use constraints, quality gates, and teacher inference budget.

## Context to inspect
Inspect task distribution, teacher failure modes, logits/targets availability, student capacity, tokenizer compatibility, and deployment hardware.

## Core knowledge
Distillation can use hard labels, soft targets, intermediate representations, or generated data. Teacher errors and biases can be amplified; student capacity limits matter more than imitation loss alone.

## Procedure
1. Define student deployment objective.
2. Establish teacher and candidate-student baselines.
3. Select representative training and holdout data.
4. Choose distillation targets and loss weighting.
5. Generate/cache teacher targets when economical.
6. Train with controlled experiments.
7. Evaluate aggregate and critical slices.
8. Compare against ordinary fine-tuning of the student.
9. Benchmark deployed performance and cost.
10. Document provenance and reproducibility.

## Decision points
Use generated examples when real coverage is insufficient but validate distribution drift. Prefer a simpler smaller model if it already meets quality targets without distillation complexity.

## Common failure patterns
Evaluating on teacher-generated data only, leakage between train/eval, copying teacher weaknesses, excessive teacher cost, and ignoring tokenizer/runtime effects.

## Verification
Student outperforms its non-distilled baseline materially, meets quality gates, and achieves the intended deployment benefit.

## Expected output
Student artifact, training recipe, provenance, quality comparison, serving benchmark, and limitations.

## Stop conditions
Stop on data-rights uncertainty, evaluation leakage, unacceptable critical-slice regression, or no meaningful advantage over simpler alternatives.