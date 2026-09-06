# LLM Judge Validation

## Purpose
Validate model-based graders before using them as automated evaluation infrastructure.

## When to use
Use when an LLM judge scores generated answers, compares variants, enforces rubrics, or replaces part of manual review.

## Inputs
Judge prompt, candidate judge model, rubric, human-labeled calibration set, target outputs, and acceptable error tolerance.

## Preconditions
A trusted human-reviewed sample exists and grading criteria are explicit.

## Context to inspect
Inspect judge prompt, model version, temperature/configuration, ordering effects, label distribution, and examples used in the rubric.

## Core knowledge
LLM judges can exhibit verbosity bias, position bias, self-preference, style bias, reference anchoring, and inconsistent scoring. Agreement with humans must be measured by category, not only globally.

## Procedure
1. Build a stratified calibration set including edge and failure cases.
2. Collect independent human labels with adjudication for disagreements.
3. Run the judge multiple times where stochasticity matters.
4. Measure agreement, false-pass, false-fail, and category-level errors.
5. Test swapped answer ordering in pairwise judging.
6. Probe verbosity, formatting, identity, and prompt-injection sensitivity.
7. Refine rubric or judge prompt only on development cases.
8. Re-evaluate on held-out calibration data.
9. Define confidence thresholds and mandatory human-review categories.
10. Version the judge configuration with evaluation results.

## Decision points
Use automated judging for scalable low-to-medium-risk assessments with demonstrated calibration. Keep human review for ambiguous or high-impact decisions and audit samples continuously.

## Common failure patterns
Using a judge because it is convenient, calibrating on the same data used for reporting, hiding false-pass rates behind correlation, and allowing candidate outputs to manipulate the grader.

## Verification
Confirm held-out agreement and false-pass rates meet explicit thresholds and judge behavior is stable across ordering and formatting probes.

## Expected output
A judge validation report, approved judge configuration, known limitations, and human-review rules.

## Stop conditions
Stop when human labels are unreliable, prompt injection can alter grading, or false-pass rates are unacceptable.