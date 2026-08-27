# Model Evaluation Rules

## Purpose
Require decision-grade evidence before accepting NLP model changes.

## Scope
Offline evaluation, baselines, metrics, slices, confidence intervals, significance, and acceptance criteria.

## MUST
- Evaluation MUST use metrics aligned with the actual task cost, not convenience alone.
- Every candidate MUST be compared with an appropriate baseline on a fixed, versioned evaluation set.
- Critical slices MUST be reported separately, including relevant languages, classes, domains, and safety cases.
- Acceptance criteria MUST be defined before production promotion for material changes.

## MUST NOT
- MUST NOT claim improvement from a single aggregate metric when material regressions exist in critical slices.
- MUST NOT compare models on different preprocessing or datasets without making the difference explicit.
- MUST NOT treat agent or reviewer confidence as empirical evidence.

## SHOULD
- Evaluation SHOULD report uncertainty and practical effect size where sample size permits.
- Human evaluation SHOULD use blinded or randomized comparison when subjective judgment is central.

## Exceptions
Metric trade-offs require documented business/task rationale, risk ownership, and approval for critical regressions.

## Verification
Check dataset/version hashes, baseline reproducibility, metric implementation tests, slice reports, statistical analysis, and signed acceptance criteria.