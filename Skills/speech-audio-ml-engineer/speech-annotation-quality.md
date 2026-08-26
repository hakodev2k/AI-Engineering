# Speech Annotation Quality

## Purpose
Design and audit annotations that are consistent enough to train and evaluate speech systems.

## When to use
Use for transcription, timestamps, speaker labels, intent, emotion, acoustic events, pronunciation, or quality annotations.

## Inputs
Annotation guidelines, labeled samples, annotator metadata, task requirements, adjudication history.

## Context to inspect
Review taxonomy, ambiguous cases, normalization rules, timing conventions, inter-annotator disagreement, and downstream metric sensitivity.

## Core knowledge
Annotation is measurement. Ambiguous definitions create an irreducible label ceiling. Agreement metrics must be interpreted relative to task prevalence and ambiguity.

## Procedure
1. Define the unit of annotation and operational label definitions.
2. Build examples for normal and boundary cases.
3. Run a pilot with multiple annotators.
4. Measure agreement and inspect disagreement clusters.
5. Refine guidelines before scaling.
6. Add gold checks and adjudication.
7. Track annotator drift over time.
8. Version labels and guidelines together.

## Decision points
Use consensus when subjective variation is meaningful; adjudication when a canonical label is required. Do not force false precision on inherently subjective labels.

## Common failure patterns
Undefined normalization, inconsistent timestamps, annotator shortcuts, changing guidelines without relabeling, and agreement metrics without error inspection.

## Verification
Audit random and high-disagreement samples, recompute agreement, and evaluate model errors against annotation uncertainty.

## Expected output
Versioned guidelines, quality metrics, adjudicated labels, and known ambiguity boundaries.

## Stop conditions
Escalate if the task cannot be labeled reliably enough to support the claimed model metric.