# Learning-to-Rank Rules

## Purpose
Ensure learned ranking systems are trained and promoted with reproducible data, leakage controls, and interpretable evidence.

## Scope
Applies to supervised ranking, pairwise/listwise learning, neural rerankers, training data, labels, and model promotion.

## MUST
- Training data, labels, feature definitions, model configuration, and evaluation splits MUST be reproducible.
- Time-based or user-based leakage risks MUST be assessed before training.
- Candidate models MUST be compared against the current baseline using agreed offline and, where required, online criteria.
- Model artifacts MUST be versioned and traceable to training evidence.

## MUST NOT
- MUST NOT train on labels derived from post-query outcomes that would be unavailable at ranking time without explicit causal justification.
- MUST NOT promote a model based only on training loss.
- MUST NOT use test-set results to iteratively tune the same model without controlling evaluation contamination.

## SHOULD
- Use ablations and segment analysis to understand material gains and regressions.

## Exceptions
Require documented methodology, evidence, risk, and approval.

## Verification
Review datasets, split logic, feature lineage, model registry metadata, evaluation reports, and experiment records.