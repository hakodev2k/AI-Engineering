# Synthetic Data Augmentation Governance

## Purpose
Use synthetic examples to fill verified coverage gaps while controlling hallucination, benchmark leakage, repetitive patterns, privacy risk, recursive model bias, and overexposure of generated data.

## When to use
Use when real examples are scarce, expensive, privacy-sensitive, or difficult to collect; when deterministic simulators can generate rare scenarios; or when targeted augmentation is needed for known failure slices. Do not use synthetic generation to invent factual ground truth that cannot be independently verified.

## Inputs
- Coverage gap and target capability
- Real-data baseline samples
- Generator model or simulator
- Generation prompts/configuration
- Quality validators or human reviewers
- Protected evaluation corpus
- Target mixture budget

## Context to inspect
Inspect generator provenance and training relationship to the target model, current real/synthetic proportions, benchmark exclusions, source diversity, generation templates, validation tooling, duplicate rates, known generator failure modes, and downstream training exposure.

## Core knowledge
Synthetic data amplifies the generator's assumptions and errors. High apparent cleanliness can hide low semantic diversity. Model-generated data should remain traceable as synthetic, deduplicated against real and protected data, independently validated, and capped according to information value rather than availability.

## Procedure
1. Define the precise coverage gap synthetic data is intended to address.
2. Establish real examples or domain rules that anchor correctness.
3. Choose a generator or simulator suited to the task and record its version.
4. Design diverse generation conditions rather than relying on one template.
5. Tag every synthetic record with generator and configuration provenance.
6. Apply structural, factual, policy, and task-specific validators.
7. Deduplicate generated records internally and against real datasets.
8. Check for benchmark or protected-evaluation contamination.
9. Human-review a stratified sample including edge cases and high-scoring examples.
10. Measure novelty, difficulty, quality, and source/template diversity.
11. Set a conservative mixture weight or exposure cap.
12. Run pilot training and compare target gains, memorization, and regressions against a real-data baseline.
13. Retain only synthetic sources whose marginal value is demonstrated.

## Decision points
Prefer deterministic simulation when domain rules can generate trustworthy labels. Prefer model generation when semantic diversity matters and independent verification exists. Collect real data instead when correctness cannot be verified or when synthetic examples repeatedly mirror generator biases. Increase generation diversity before increasing raw volume.

## Common failure patterns
- Treating generator confidence as correctness
- Hiding synthetic provenance after dataset merges
- Recursively training on generations from descendants of the same model family
- Producing large numbers of near-identical template variants
- Allowing benchmark questions to enter generation prompts
- Replacing scarce real data entirely with synthetic examples
- Evaluating synthetic quality only with the same model that generated it

## Verification
Implemented means synthetic examples are traceable, validated, deduplicated, and mixed according to policy. Verified means human audits and controlled training experiments show measurable improvement on target slices without unacceptable contamination, memorization, diversity loss, or regression.

## Expected output
A governed synthetic dataset with provenance, generation configuration, validator results, novelty and duplicate statistics, mixture limits, audit samples, and pilot-training evidence.

## Stop conditions
Stop when no independent correctness signal exists for a factual task, benchmark leakage cannot be excluded, synthetic diversity collapses, policy or privacy constraints are unresolved, or pilot training shows no marginal benefit.