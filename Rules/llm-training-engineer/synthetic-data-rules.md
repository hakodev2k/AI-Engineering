# Synthetic Training Data Rules

## Purpose
Use generated data without amplifying model errors, contaminating evaluations, or obscuring provenance.

## Scope
Model-generated instructions, responses, reasoning traces, preference pairs, critiques, transformations, and augmentation.

## MUST
- Synthetic datasets MUST identify generator model/version, prompt or generation policy, decoding configuration, filters, and creation date.
- Synthetic data MUST be quality-evaluated on representative samples and critical slices before material mixture inclusion.
- Generation pipelines MUST check for evaluation contamination and prohibited sensitive content where relevant.
- Synthetic contribution to the final mixture MUST be measurable and versioned.
- Recursive use of model-generated data MUST be assessed for diversity loss, error reinforcement, and distribution collapse.

## MUST NOT
- MUST NOT represent synthetic examples as human-authored or independently verified.
- MUST NOT use generator confidence as proof of correctness.
- MUST NOT train on generated benchmark solutions while claiming independent benchmark generalization.

## SHOULD
- Synthetic data SHOULD target identifiable coverage gaps or controlled transformations rather than indiscriminate volume.
- High-impact labels SHOULD use external verification, consensus, executable checks, or human review where feasible.

## Exceptions
Exploratory synthetic corpora may use lighter review if isolated from release training and clearly labeled.

## Verification
Inspect generation manifests, model/prompt versions, filter reports, sampled quality audits, contamination checks, mixture accounting, and downstream ablations.