# Annotation System Design

## Purpose
Design annotation workflows that produce consistent, auditable ground truth at acceptable cost and speed.

## When to use
Use when labels are ambiguous, new classes/tasks are introduced, annotation quality limits model performance, or external labeling vendors are involved.

## Inputs
Task specification, ontology, sample media, annotator capabilities, quality targets, budget, and privacy constraints.

## Context to inspect
Existing label schema, disagreement patterns, edge cases, tooling, reviewer workflow, model-assisted labeling, and downstream metric sensitivity.

## Core knowledge
Annotation quality is a system property. Ontology clarity, task decomposition, annotator training, adjudication, inter-annotator agreement, gold sets, and versioning determine label reliability. Bounding boxes, polygons, masks, tracks, keypoints, and text transcription have different ambiguity and cost profiles.

## Procedure
1. Derive the ontology from the prediction objective.
2. Define positive, negative, ignore, uncertain, and out-of-scope cases.
3. Write visual examples for boundary cases.
4. Choose annotation primitives that match required precision.
5. Pilot on a representative sample with multiple annotators.
6. Measure disagreement and categorize causes.
7. Refine guidelines before scaling volume.
8. Create qualification and gold-set checks.
9. Define review and adjudication thresholds.
10. Track annotator, guideline, and ontology versions.
11. Audit systematic errors by class and slice.
12. Feed recurring ambiguity back into task formulation or ontology.

## Decision points
Use consensus when ambiguity is intrinsic; expert adjudication when mistakes are costly; model-assisted labeling when speed gains do not anchor annotators toward model errors.

## Common failure patterns
Changing ontology without relabeling, treating annotator disagreement as noise, accepting boxes with inconsistent tightness, missing ignore regions, and optimizing cost per label rather than usable information.

## Verification
Verify agreement metrics, gold-set performance, sampled reviewer accuracy, ontology-version traceability, and downstream performance on adjudicated labels.

## Expected output
Versioned annotation guidelines, QA workflow, adjudication rules, quality metrics, and an auditable labeled dataset.

## Stop conditions
Stop if the ontology cannot be made operationally consistent, sensitive media cannot be handled safely, or annotation precision cannot support required evaluation.