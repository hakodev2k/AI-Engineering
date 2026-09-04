# Model Memorization and Extraction Testing

## Purpose
Assess whether an AI model reproduces sensitive training or user data under realistic and adversarial prompting, and turn findings into measurable mitigations.

## When to use
Use before releasing fine-tuned models, after training on sensitive corpora, when changing training recipes, or after suspected privacy leakage.

## Inputs
- Model endpoint or checkpoint
- Training-data samples and canaries where approved
- Prompting interface
- Risk thresholds
- Evaluation harness

## Context to inspect
Inspect dataset duplication, rare strings, training epochs, checkpoint lineage, sampling settings, output filters, and access controls.

## Core knowledge
Memorization risk rises with duplication, uniqueness, overfitting, and model capacity. Exact-match tests alone miss semantic disclosure; evaluation should include targeted extraction, membership-style signals, and near-duplicate outputs while avoiding creation of unnecessary sensitive test artifacts.

## Procedure
1. Define protected data classes and release threshold.
2. Select representative sensitive and control samples.
3. Create approved canaries when safe and useful.
4. Test direct completion, prefix, paraphrase, role-play, and iterative extraction prompts.
5. Compare exact and semantic similarity against protected samples.
6. Analyze risk by rarity, duplication, and training exposure.
7. Re-run across decoding settings and model versions.
8. Apply mitigations such as data filtering, deduplication, regularization, retraining, or output controls.
9. Repeat tests after mitigation.
10. Record limitations and residual risk.

## Decision points
Prefer upstream dataset fixes over output filtering when leakage is rooted in memorization. Use stronger release gates for secrets, health, financial, or uniquely identifying data.

## Common failure patterns
- Testing only benign prompts
- Measuring only exact string matches
- Using production secrets as test canaries
- Ignoring duplicate sensitive records
- Declaring success after adding a superficial refusal prompt

## Verification
Verify against a fixed adversarial suite, holdout controls, multiple random seeds or decoding settings, and regression tests across candidate checkpoints.

## Expected output
A leakage-risk report with test methodology, evidence, mitigations, regression suite, and release recommendation.

## Stop conditions
Escalate when sensitive data is reproducibly extractable, test data cannot be handled safely, or mitigation requires retraining that has not been approved.