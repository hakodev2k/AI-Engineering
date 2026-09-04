# Drift Detection Rules

## Purpose
Detect material changes in AI inputs, retrieval behavior, model behavior, and user outcomes before they become sustained production failures.

## Scope
Applies to input distributions, embeddings, retrieval results, model outputs, quality signals, usage patterns, and downstream outcomes.

## MUST
- Drift monitors MUST define the baseline population, comparison window, metric, threshold, and expected operational response.
- Drift detection MUST distinguish data-volume changes from distribution changes where practical.
- Material drift alerts MUST include enough segmentation to identify affected use cases, tenants, models, or traffic classes without exposing sensitive data.
- Baselines MUST be refreshed only through a controlled process that prevents active regressions from becoming the new normal.
- Drift signals used for release or rollback decisions MUST be validated against known historical changes or synthetic tests.

## MUST NOT
- Statistical significance MUST NOT be treated automatically as operational significance.
- Drift thresholds MUST NOT be changed solely to silence persistent alerts without investigation.
- A single global distribution MUST NOT hide known high-risk segments.

## SHOULD
- Monitor retrieval-score and embedding-space shifts when changes to corpus or embedding models are operationally important.
- Combine drift signals with quality and incident evidence before broad remediation.

## Exceptions
Where robust statistical monitoring is infeasible, use documented heuristic indicators and periodic human review.

## Verification
Review baseline definitions, threshold history, validation cases, alert actions, segment coverage, and evidence from a known distribution shift.