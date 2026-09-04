# AI Quality Signal Rules

## Purpose
Define production-observable indicators of AI answer quality without confusing proxy signals with validated quality.

## Scope
Applies to groundedness, relevance, correctness proxies, refusal behavior, user feedback, automated evaluators, and business outcome signals.

## MUST
- Every automated quality signal MUST document what it measures, known limitations, expected false positives/negatives, and the decision it supports.
- Quality telemetry MUST distinguish observed user outcomes from model-based evaluator judgments.
- Material quality regressions MUST be evaluated against a stable baseline or control cohort.
- Evaluator model/version and rubric changes MUST be versioned and correlated with metric shifts.
- High-impact quality alerts MUST use multiple supporting signals or validated thresholds when a single proxy is insufficient.

## MUST NOT
- An LLM-as-judge score MUST NOT be represented as ground truth.
- Positive user engagement MUST NOT automatically be interpreted as factual correctness or safety.
- Quality metrics MUST NOT silently change semantics after prompt, evaluator, or dataset changes.

## SHOULD
- Combine automated evaluation, user feedback, operational evidence, and sampled human review where appropriate.
- Segment quality by use case and risk rather than relying only on a global average.

## Exceptions
Single-signal decisions require documented validation evidence and bounded impact.

## Verification
Review evaluator versions, rubrics, baselines, metric definitions, calibration studies, human-review samples, and change-correlation records.