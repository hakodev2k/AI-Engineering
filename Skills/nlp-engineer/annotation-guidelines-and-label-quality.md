# Annotation Guidelines and Label Quality

## Purpose
Create label systems and annotation processes that produce consistent, auditable supervision for ambiguous language tasks.

## When to use
Use when defining labels, hiring annotators, repairing noisy labels, or building gold evaluation sets.

## Inputs
Task definition, examples, candidate labels, annotator population, adjudication budget, target metrics.

## Preconditions
The desired decision boundary can be expressed with examples and counterexamples.

## Context to inspect
Existing guidelines, confusion matrix, annotator disagreements, class prevalence, edge cases, demographic/language slices.

## Core knowledge
Language labels are frequently subjective. Agreement depends on operational definitions, precedence rules, context availability, and adjudication—not only annotator effort.

## Procedure
1. Define each label with inclusion and exclusion criteria.
2. Add positive, negative, and boundary examples.
3. Define precedence for overlapping categories.
4. Specify required context and an uncertainty option.
5. Pilot with multiple annotators.
6. Measure agreement and inspect disagreements qualitatively.
7. Refine guidelines where disagreement reveals ambiguity.
8. Establish adjudication and gold-check procedures.
9. Audit slice-level disagreement and annotator drift.
10. Version labels and migration rules.

## Decision points
Use single annotation for objective low-risk labels; use overlap and adjudication for subjective or high-impact labels. Merge categories when humans cannot distinguish them reliably.

## Common failure patterns
Definitions by intuition, no edge cases, forced labels for ambiguous text, leakage from model predictions, and reporting raw agreement without class-aware analysis.

## Verification
Pilot agreement is acceptable for task risk, adjudication resolves recurring ambiguities, and gold-set reviews are reproducible.

## Expected output
Versioned annotation guide, gold examples, quality metrics, adjudication protocol, and known ambiguity areas.

## Stop conditions
Stop when experts cannot agree on the target distinction or required context is unavailable to annotators.