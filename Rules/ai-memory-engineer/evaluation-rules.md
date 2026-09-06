# Memory Evaluation Rules

## Purpose
Measure whether memory improves task performance without increasing hallucination, leakage, or stale-context errors.

## Scope
Retrieval quality, write quality, conflict handling, faithfulness, personalization, and end-to-end agent outcomes.

## MUST
- Memory changes MUST be evaluated on representative tasks before production promotion.
- Evaluations MUST separately measure retrieval relevance, memory correctness, and downstream task impact.
- Benchmarks MUST include stale, conflicting, missing, adversarial, and privacy-sensitive cases.
- Improvements MUST be supported by baseline comparisons and reproducible evidence.

## MUST NOT
- MUST NOT use model preference alone as proof of memory correctness.
- MUST NOT optimize a single aggregate score while hiding safety regressions.
- MUST NOT reuse contaminated evaluation examples as training or tuning inputs without accounting for leakage.

## SHOULD
- Track precision, recall, harmful retrieval rate, stale retrieval rate, and task success where meaningful.
- Maintain regression suites for production incidents.

## Exceptions
Exceptions require documented limitations and compensating review.

## Verification
Review datasets, metric definitions, baseline results, failure slices, and reproducibility artifacts.