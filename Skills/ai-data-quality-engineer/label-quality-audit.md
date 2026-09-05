# Label Quality Audit

## Purpose
Assess whether supervised labels are accurate, consistent, sufficiently specified, and suitable for model training or evaluation.

## When to use
Use before model training, after annotation-policy changes, when annotator disagreement rises, or when model errors suggest label noise.

## Inputs
Labeled dataset, annotation guidelines, annotator metadata, gold examples, disagreement metrics, model error samples.

## Preconditions
A valid label taxonomy and intended task definition exist.

## Context to inspect
Annotation workflow, reviewer process, class balance, ambiguous cases, adjudication history, sampling strategy, label provenance.

## Core knowledge
Label quality includes correctness, consistency, ambiguity handling, coverage, and temporal relevance. Inter-annotator agreement is evidence, not proof of correctness.

## Procedure
1. Sample labels across classes, sources, time, and difficult cases.
2. Re-annotate a blind subset.
3. Measure agreement and confusion patterns.
4. Compare against gold or adjudicated examples.
5. Identify ambiguous or underspecified guidelines.
6. Quantify likely noise by class and subgroup.
7. Correct systematic annotation defects.
8. Update guidelines and reviewer rules.
9. Re-audit changed labels.
10. Add ongoing label-quality monitoring.

## Decision points
Relabel when defects are systematic; tolerate irreducible ambiguity only when represented explicitly in task design.

## Common failure patterns
Using aggregate accuracy only, ignoring rare classes, treating majority vote as truth, and changing labels without versioning.

## Verification
Re-annotation shows improved agreement and sampled labels conform to current guidelines.

## Expected output
A label-quality report, corrected guidance, remediation scope, and confidence estimate.

## Stop conditions
Stop when task semantics are disputed or no authoritative adjudication path exists.