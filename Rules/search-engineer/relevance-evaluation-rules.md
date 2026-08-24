# Relevance Evaluation

## Purpose
Make offline relevance evaluation statistically and operationally credible.

## Scope
Judgment sets, metrics, assessors, sampling, benchmarks, and evaluation governance.

## MUST
- Define judgment criteria before assessment and keep them stable within a comparable evaluation.
- Sample queries to represent important traffic and explicitly include critical low-frequency classes.
- Version judgments, corpus snapshot, metric implementation, and evaluation configuration.
- Investigate disagreements and metric movement large enough to affect release decisions.

## MUST NOT
- Reuse test queries as training examples without tracking leakage risk.
- cherry-pick favorable queries or metrics.
- Compare scores across incompatible datasets as though they were directly comparable.

## SHOULD
- Track inter-rater agreement where human judgments are used.
- Use multiple metrics when they represent distinct user outcomes.

## Exceptions
Exceptions require limitations, expected bias, alternative evidence, and reviewer acceptance.

## Verification
Inspect sampling, judgment guidelines, dataset/version metadata, metric code, leakage checks, and segmented reports.