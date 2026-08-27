# LLM-as-Judge Rules

## Purpose
Control bias, instability, and misuse when language models grade AI outputs.

## Scope
Applies to pointwise grading, pairwise preference, rubric scoring, critique generation, and automated evaluator ensembles.

## MUST
- Model judges MUST be validated against human or authoritative reference judgments before being used for release gates.
- Judge prompts, model versions, sampling parameters, and output parsing logic MUST be versioned.
- Known judge biases such as position, verbosity, style, self-preference, and prompt sensitivity MUST be tested when relevant.
- High-impact decisions MUST include a fallback review path for ambiguous or low-confidence judgments.
- Automated judge failures and unparsable outputs MUST be surfaced rather than silently mapped to passing scores.

## MUST NOT
- MUST NOT assume a stronger model is automatically an unbiased evaluator.
- MUST NOT use the evaluated system itself as the sole judge of its own correctness or safety.
- MUST NOT compare historical scores across materially changed judges without recalibration.

## SHOULD
- Pairwise evaluations SHOULD randomize response order when order bias is possible.
- Multiple judges or repeated judgments SHOULD be considered where variance materially affects decisions.

## Exceptions
A single unvalidated judge may be used for exploratory analysis only when results are explicitly non-gating.

## Verification
Compare judge outputs with a blinded human-labeled sample, measure agreement and directional bias, inspect prompt/version metadata, and test stability under order and formatting perturbations.