# Synthetic Data Strategy

## Purpose
Define when and how synthetic data should be used to improve model development, evaluation, privacy, coverage, or system testing without creating misleading confidence.

## When to use
Use when real data is scarce, sensitive, expensive, imbalanced, difficult to label, or insufficient for rare scenarios. Do not use synthetic data as a default substitute for representative real-world evidence.

## Inputs
Business objective, target model/task, real-data availability, privacy constraints, rare-event requirements, evaluation criteria, budget, latency, compliance requirements.

## Preconditions
The target use case and downstream decision are understood. Real-data limitations are documented.

## Context to inspect
Existing datasets, data contracts, label definitions, model failure modes, production traffic characteristics, privacy policy, regulatory constraints, evaluation pipeline.

## Core knowledge
Synthetic data is valuable when it increases useful coverage, privacy, controllability, or reproducibility. It can also amplify model bias, generator artifacts, leakage, unrealistic correlations, or benchmark overfitting. Senior practice requires explicit success criteria and a plan to validate synthetic-to-real transfer.

## Procedure
1. Define the downstream task and why real data is insufficient.
2. Classify the intended benefit: augmentation, privacy, rare-event coverage, testing, simulation, balancing, or bootstrapping.
3. Identify which properties must match reality and which may be intentionally manipulated.
4. Define quality, utility, privacy, fairness, and diversity metrics.
5. Select a generation approach: rules, simulation, generative model, LLM, diffusion model, procedural generation, or hybrid.
6. Define real-data holdouts that will never be used to tune the generator.
7. Establish acceptance thresholds for downstream utility.
8. Estimate generation, review, storage, and evaluation cost.
9. Define provenance and versioning requirements.
10. Run a pilot before scaling production generation.

## Decision points
Use simulation when causal rules are known and controllable. Use generative models when high-dimensional realism matters. Use hybrid methods when domain constraints must be guaranteed.

## Common failure patterns
Optimizing visual plausibility instead of downstream utility, training and evaluating on the same generator distribution, ignoring privacy leakage, and assuming more synthetic samples always improve performance.

## Verification
Synthetic data must improve a predefined downstream metric on independent real-world validation data without violating privacy or fairness thresholds.

## Expected output
A documented synthetic-data strategy with use case, generation method, validation plan, risks, and acceptance criteria.

## Stop conditions
Stop and escalate when no trustworthy real-world validation set exists, sensitive-data policy is unclear, or the generator cannot meet minimum utility or privacy thresholds.