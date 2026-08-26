# Continued Pretraining

## Purpose
Adapt a pretrained model to new domains, languages, knowledge distributions, or context while controlling catastrophic forgetting.

## When to use
Use when broad next-token training on additional unlabeled data is more appropriate than task-specific supervised tuning.

## Inputs
Base checkpoint, adaptation corpus, baseline/general evaluations, tokenizer, compute budget, target domain metrics.

## Context to inspect
Base training distribution if known, domain shift, tokenizer efficiency, data quality, mixture repetition, optimizer reset policy, and general-capability guardrails.

## Core knowledge
Continued pretraining can improve target-domain modeling while degrading general capabilities. Learning rate, mixture composition, token count, and inclusion of replay/general data govern the trade-off.

## Procedure
1. Establish immutable base-checkpoint evaluations.
2. Characterize domain shift and tokenizer behavior.
3. Build a high-quality adaptation mixture with contamination controls.
4. Decide whether to include general-data replay.
5. Choose conservative optimizer/schedule defaults.
6. Run small token-budget pilots.
7. Evaluate target gains and general regressions at intervals.
8. Adjust mixture or horizon based on evidence.
9. Save milestone checkpoints for rollback and comparison.
10. Document delta from the base model.

## Decision points
Use continued pretraining for broad distribution adaptation; use supervised/post-training methods for instruction behavior. Add replay when forgetting is material. Stop early when marginal target gains no longer justify general regression.

## Common failure patterns
High LR causing rapid forgetting; repeated narrow corpus; no general benchmark guardrails; contaminated domain evaluations; assuming lower domain loss equals better downstream utility.

## Verification
Target evaluations improve beyond uncertainty, general/safety regressions remain within predefined limits, and results reproduce from the recorded base checkpoint and corpus.

## Expected output
An adapted checkpoint with training recipe, domain/general evaluation comparison, and known trade-offs.

## Stop conditions
Stop for severe forgetting, memorization indicators, contaminated evaluation, or unresolved data rights.