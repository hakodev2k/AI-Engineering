# Preference Data Design

## Purpose
Design preference datasets that reveal meaningful behavioral trade-offs and provide learnable signals for post-training algorithms.

## When to use
Use for DPO-family training, reward modeling, RLHF, ranking-based evaluation, or comparative behavior repair. Avoid pairwise preference collection when correctness is directly verifiable and an objective reward is available.

## Inputs
- Post-training objectives
- Candidate prompts and response generators
- Preference rubric
- Risk and demographic slices
- Labeling budget and evaluator capabilities

## Preconditions
The preference question is well-defined, candidates are sufficiently different to judge, and labelers can abstain when evidence is insufficient.

## Context to inspect
Review prompt distribution, candidate-generation temperatures/models, response-length distributions, policy edge cases, annotator population, label interface, historical disagreement, and target deployment distribution.

## Core knowledge
Preference data is informative when comparisons expose consequential differences. If one response is trivially superior, examples add little boundary information; if both are incomparable, labels become noise. Candidate-generation policy affects what the learned policy can distinguish. Length, verbosity, formatting, position, and model identity can create spurious preference signals.

## Procedure
1. Define preference dimensions and a precedence rule for conflicts.
2. Sample prompts from representative and high-risk slices.
3. Generate candidate responses with enough diversity to expose behavior boundaries.
4. Remove exact duplicates and comparisons with no meaningful distinction.
5. Randomize presentation order and hide irrelevant model metadata.
6. Include explicit tie/abstain options rather than forcing arbitrary choices.
7. Add targeted comparisons for known failure modes and safety boundaries.
8. Measure response-length and style correlations with labels.
9. Collect multiple judgments on ambiguous/high-impact subsets.
10. Analyze inter-rater agreement by slice and rubric dimension.
11. Audit disagreements to refine instructions or split overloaded criteria.
12. Reserve untouched preference holdouts for evaluation.
13. Version prompts, candidates, labels, rationales, and provenance.

## Decision points
- Prefer pairwise labels for relative quality; use ranked lists when amortizing several candidates per prompt is valuable.
- Include rationales when they improve auditability or train a judge, but do not assume rationale text is causally faithful.
- Resample candidate pairs when quality gaps are consistently too easy or too ambiguous.

## Common failure patterns
Position bias; length bias; preference for polished but incorrect answers; forced binary choices; one generator dominating both sides; inconsistent safety/helpfulness precedence; leakage from model names; unrepresentative prompt distribution.

## Verification
Quantify label balance, ties, agreement, candidate-source balance, length/style correlations, slice coverage, and train/holdout separation. Manually review examples near the decision boundary and high-impact disagreements.

## Expected output
A versioned preference dataset and collection specification with rubrics, candidate-generation policy, quality statistics, disagreement analysis, provenance, and known biases.

## Stop conditions
Stop if preference criteria cannot be applied consistently, evaluator disagreement remains unexplained on critical slices, candidate generation fails to produce useful contrasts, or privacy/provenance requirements are unresolved.