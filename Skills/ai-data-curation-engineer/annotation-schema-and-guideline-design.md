# Annotation Schema and Guideline Design

## Purpose
Design labels, rubrics, and annotation instructions that convert ambiguous model goals into consistent, auditable human judgments.

## When to use
Use before launching supervised labels, preference comparisons, safety tags, domain classifications, structured extraction, or expert annotation.

## Inputs
Task definition, representative examples, model failure cases, target metrics, annotator profile, tooling constraints, and policy requirements.

## Context to inspect
Inspect existing label taxonomies, downstream loss or evaluation logic, edge cases, historical disagreement, source diversity, and whether labels will be single-choice, multi-label, ranked, scalar, or free-form.

## Core knowledge
Annotation quality depends more on task decomposition and operational definitions than instruction length. Categories should be mutually interpretable, examples should cover boundaries, and legitimate ambiguity must be representable rather than forced into false certainty.

## Procedure
1. Define the decision each label supports.
2. Draft the minimum label schema needed downstream.
3. Write observable criteria for every label.
4. Add positive, negative, and boundary examples.
5. Define precedence rules for overlapping categories.
6. Add an uncertain/escalate path where ambiguity is real.
7. Pilot with multiple annotators on stratified samples.
8. Measure agreement and inspect disagreement causes.
9. Revise schema or guidance before scaling.
10. Version guidelines and preserve change history.

## Decision points
Split categories when disagreement reflects multiple concepts; merge when categories are not operationally distinguishable. Use expert annotators when domain judgment materially affects correctness. Do not over-specify subjective tasks into artificial precision.

## Common failure patterns
- Labels defined by examples only
- Hidden overlap between categories
- No ambiguity path
- Changing guidelines midstream without versioning
- Measuring agreement without investigating systematic disagreement

## Verification
Implemented means annotators can execute the task. Verified means pilot agreement, adjudication quality, and downstream label utility meet defined thresholds across key slices.

## Expected output
A versioned annotation schema, guideline, example set, ambiguity policy, pilot metrics, and revision record.

## Stop conditions
Stop when target concepts cannot be operationalized, required expertise is unavailable, or disagreement reveals unresolved product or policy decisions.