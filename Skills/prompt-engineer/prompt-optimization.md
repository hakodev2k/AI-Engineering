# Prompt Optimization

## Purpose
Improve an existing prompt using evidence while preserving its intended behavior, constraints, and output contract.

## When to use
Use when a prompt is valid but has quality, consistency, cost, latency, or usability problems. Do not optimize without observable evidence of a problem.

## Inputs
Current prompt, task specification, representative inputs, outputs, failure cases, model configuration, and evaluation criteria.

## Preconditions
Define what must remain unchanged and establish a baseline evaluation set.

## Context to inspect
Prompt versions, evaluation results, model/tool settings, examples, user feedback, and downstream validation.

## Core knowledge
Optimization is an experiment, not a rewrite exercise. Changes can trade accuracy for cost, robustness for verbosity, or flexibility for determinism. Evaluate behavior rather than wording quality.

## Procedure
1. Capture the baseline prompt and representative cases.
2. Classify observed failures by root cause.
3. Change one meaningful factor at a time where practical.
4. Clarify instructions, ordering, examples, constraints, or decomposition only when evidence supports the change.
5. Re-run the baseline cases.
6. Test adversarial and edge cases.
7. Compare quality, latency, token usage, and failure rates.
8. Keep only changes with measurable benefit and acceptable regressions.
9. Record the rationale and rollback point.

## Decision points
Prefer simpler prompts when they achieve equivalent results. Add examples when behavior is difficult to specify abstractly. Add decomposition when a task contains separable reasoning stages. Move deterministic checks into code instead of adding more prose.

## Common failure patterns
Changing many variables at once; optimizing for one example; making prompts longer without improving behavior; losing output constraints; ignoring cost or latency.

## Verification
Baseline and candidate results are compared on the same evaluation set, including regressions and operational metrics.

## Expected output
An improved prompt version plus measurable evaluation evidence and a concise change rationale.

## Stop conditions
Stop when improvements are not statistically or practically meaningful, required evaluation data is missing, or a change introduces unacceptable regressions.