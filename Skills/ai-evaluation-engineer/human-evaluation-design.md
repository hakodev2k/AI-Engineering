# Human Evaluation Design

## Purpose
Design reliable human-review workflows for qualities that cannot be measured safely with deterministic rules alone, such as usefulness, nuance, style, factuality, and preference.

## When to use
Use when automated metrics are insufficient, when calibrating judge models, or when release decisions depend on expert or user judgment.

## Inputs
- Evaluation questions
- Candidate outputs
- Reviewer population
- Annotation budget
- Risk level and expected disagreement

## Context to inspect
Inspect existing rubrics, prior agreement rates, reviewer expertise, task complexity, sampling method, and any incentives that may bias labels.

## Core knowledge
Human labels are measurements with variance. Good programs use precise rubrics, blind comparison where possible, calibration examples, inter-rater agreement, adjudication, and separation of reviewer identity from model identity.

## Procedure
1. Translate product quality into observable reviewer criteria.
2. Decide between absolute scoring, pairwise preference, ranking, or error tagging.
3. Write a rubric with positive, negative, and boundary examples.
4. Pilot with multiple reviewers and inspect disagreement.
5. Refine ambiguous rubric language before scaling.
6. Blind model identity and irrelevant metadata.
7. Randomize ordering to control position bias.
8. Define reviewer qualification and calibration checks.
9. Collect duplicate annotations on a representative subset.
10. Measure agreement and adjudicate high-impact disagreements.
11. Analyze results by reviewer and task slice for systematic bias.
12. Version the rubric with the dataset and results.

## Decision points
Use pairwise comparison when relative quality is easier to judge than absolute quality. Use domain experts when correctness requires specialized knowledge. Use multiple independent raters for subjective or high-risk decisions.

## Common failure patterns
- Vague rubrics
- Unblinded model identity
- Single-rater ground truth
- Reviewer fatigue
- Position bias
- Mixing rubric versions in one report

## Verification
Verify calibration accuracy, agreement statistics, adjudication consistency, ordering balance, and reproducibility on a held-out reviewer batch.

## Expected output
A documented human-evaluation protocol with rubric, sampling, reviewer controls, agreement metrics, and adjudication rules.

## Stop conditions
Stop when reviewers lack required expertise, agreement remains too low for the intended decision, or the task exposes sensitive material without approved handling controls.