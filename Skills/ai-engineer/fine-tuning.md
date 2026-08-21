# Fine-Tuning Decision and Execution

## Purpose
Decide whether fine-tuning is justified and, when it is, build a safe data and evaluation pipeline around it.

## When to use
Use when prompt/RAG approaches plateau, behavior must be made more consistent, or domain style/task patterns repeat at scale.

## Inputs
Baseline evaluations, failure categories, candidate training data, privacy constraints, model/provider capabilities, budget.

## Preconditions
Demonstrate that the target problem is not better solved with clearer prompts, deterministic logic, retrieval, or tool use.

## Context to inspect
Production failures, prompt complexity, training data quality, label consistency, evaluation leakage, model update policy.

## Core knowledge
Fine-tuning changes behavior, not source-of-truth freshness. It can improve format, style, classification, or repeated reasoning patterns, but poor data scales poor behavior. Training and evaluation sets must be separated and versioned.

## Procedure
1. Define the exact behavior gap and baseline score.
2. Verify simpler interventions have been tested.
3. Collect high-quality representative examples with provenance.
4. Remove duplicates, sensitive data, and inconsistent labels.
5. Split training, validation, and holdout evaluation sets by meaningful boundaries.
6. Train a small experiment first.
7. Compare against baseline on quality, safety, latency, and cost.
8. Analyze regressions by slice.
9. Version dataset, model, hyperparameters, and evaluation results.
10. Deploy gradually with rollback and monitoring.

## Decision points
Choose RAG for changing knowledge; fine-tuning for behavior patterns. Use synthetic data only when validated against real examples.

## Common failure patterns
Training on evaluation cases, using low-quality synthetic data, fine-tuning to memorize facts, ignoring safety regressions, and no rollback model.

## Verification
Holdout evaluations must improve target behavior without unacceptable regressions; production canary metrics must match expectations.

## Expected output
A defensible fine-tuning decision or a versioned tuned model with evaluation evidence.

## Stop conditions
Stop when data rights are unclear, holdout data is insufficient, or simpler solutions meet requirements.