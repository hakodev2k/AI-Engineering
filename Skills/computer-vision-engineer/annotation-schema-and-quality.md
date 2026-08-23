# Annotation Schema and Quality

## Purpose
Design annotation instructions, taxonomies, and QA controls that produce labels fit for model training and evaluation.

## When to use
Use for new labeling projects, taxonomy changes, or label-quality investigations.

## Inputs
Task definition, examples, edge cases, annotator workflow, quality targets.

## Preconditions
The model output and evaluation semantics are understood.

## Context to inspect
Existing schemas, disagreement patterns, tooling constraints, ambiguous examples, reviewer data.

## Core knowledge
Label noise may be systematic. Clear ontology, adjudication, inter-annotator agreement, and gold-set checks are essential.

## Procedure
1. Define classes, attributes, geometry, and ignore rules.
2. Document boundary and ambiguity cases.
3. Create positive/negative examples.
4. Pilot with multiple annotators.
5. Measure agreement and defect types.
6. Refine guidelines.
7. Add review and adjudication stages.
8. Version schema changes and migration rules.

## Decision points
Single-pass vs consensus labeling; exhaustive labels vs task-specific labels.

## Common failure patterns
Ambiguous taxonomies, changing semantics silently, rewarding speed over correctness, no uncertainty labels.

## Verification
Audit random and hard subsets, agreement metrics, schema consistency, and downstream model sensitivity.

## Expected output
Versioned annotation guide, QA workflow, acceptance thresholds, and adjudication rules.

## Stop conditions
Stop when target semantics cannot be made sufficiently objective or labeling quality remains below threshold.