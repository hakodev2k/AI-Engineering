# LLM Output Quality Evaluation

## Purpose
Evaluate open-ended LLM outputs with criteria that are repeatable enough for release decisions while preserving domain nuance.

## When to use
Use for summarization, generation, reasoning support, extraction with fuzzy semantics, assistants, copilots, and other outputs that cannot be fully validated with exact-match assertions.

## Inputs
Task definition, sample inputs, desired behavior, forbidden behavior, domain guidance, evaluator options, and business risk.

## Preconditions
The team can state what a good output means in observable terms.

## Context to inspect
Review prompts, system instructions, model parameters, reference examples, prior failures, product UX, and downstream use of the output.

## Core knowledge
Quality is multidimensional. Common dimensions include correctness, relevance, completeness, groundedness, instruction following, clarity, style, safety, and usefulness. Composite scores can hide severe failures, so critical dimensions should retain individual gates.

## Procedure
1. Define task-specific quality dimensions.
2. Write observable rubric levels with examples.
3. Identify dimensions that are hard release gates.
4. Select human, programmatic, or model-based graders for each dimension.
5. Calibrate graders on representative cases.
6. Run the evaluation with system version metadata captured.
7. Inspect per-dimension, per-category, and tail results.
8. Manually review disagreements and severe failures.
9. Compare with baseline using confidence intervals where practical.
10. Record regressions, wins, and unresolved trade-offs.

## Decision points
Use deterministic checks where structure or facts can be verified mechanically. Use human review for high-stakes ambiguity. Use LLM judges for scale only after calibration and with periodic audits.

## Common failure patterns
Single overall scores, vague rubrics, biased judges, judging style instead of correctness, changing rubric mid-comparison, and ignoring category-level regressions.

## Verification
Confirm rubric consistency, evaluator calibration, system version capture, and manual inspection of severe or disputed cases.

## Expected output
A quality evaluation report with per-dimension results, confidence notes, failure examples, and release recommendation.

## Stop conditions
Stop when acceptance criteria cannot be operationalized or evaluator disagreement is too high to support a decision.