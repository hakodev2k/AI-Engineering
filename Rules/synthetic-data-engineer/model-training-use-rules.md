# Model Training Use Rules

## Purpose
Control how synthetic data is introduced into model training so utility gains do not create hidden bias, leakage, instability, or false confidence.

## Scope
Applies to pretraining, fine-tuning, augmentation, curriculum learning, class balancing, distillation, preference optimization, and retraining workflows that consume synthetic data.

## MUST
- Define the purpose and expected contribution of synthetic data before changing training mixtures.
- Track synthetic provenance and mixing ratios at the dataset, split, and training-run level.
- Compare downstream performance against appropriate real-only or prior approved baselines.
- Evaluate whether synthetic augmentation changes calibration, subgroup performance, robustness, or rare-case behavior.
- Detect feedback loops when model-generated data is used to train later generations of the same or related model family.
- Bound the influence of low-confidence or weakly labeled synthetic examples.

## MUST NOT
- Increase synthetic-data volume solely because it is inexpensive to generate.
- Mix synthetic and real data without preserving the ability to separate and analyze their effects.
- Treat improved training loss as proof of better real-world utility.
- Recycle model outputs across generations without monitoring quality collapse, homogenization, or error reinforcement.

## SHOULD
- Run ablations that isolate the contribution of major synthetic sources.
- Weight or sample data according to validated utility rather than raw availability.
- Maintain representative real validation and test sets for final decisions.

## Exceptions
A training workflow that cannot isolate synthetic contribution must document the reason, uncertainty, risk, and compensating evaluation.

## Verification
Inspect data manifests, training configurations, mixture ratios, ablation studies, real-world validation, calibration and subgroup metrics, and lineage from generator version to model run.