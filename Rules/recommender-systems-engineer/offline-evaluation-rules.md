# Offline Evaluation Rules

## Purpose
Provide reliable pre-production evidence for recommendation changes.

## Scope
Applies to ranking metrics, retrieval metrics, counterfactual proxies, test sets, and baseline comparisons.

## MUST
- Offline evaluation datasets MUST be temporally separated from training data and representative of intended traffic.
- Metric definitions MUST be versioned and identical across compared models.
- Evaluation MUST include segment-level results for materially different user, item, locale, or traffic populations when relevant.
- Statistical uncertainty or repeated-run variability MUST be reported for noisy metrics.
- Retrieval and ranking changes MUST be compared against an appropriate stable baseline.

## MUST NOT
- MUST NOT select a model solely from one aggregate metric when known trade-offs exist.
- MUST NOT tune repeatedly on a nominal test set without controlling evaluation leakage.
- MUST NOT treat offline improvement as proof of online user benefit.

## SHOULD
- Metrics SHOULD include relevance, coverage, diversity, calibration, and constraint violations as appropriate.
- Error analysis SHOULD inspect representative wins and regressions.

## Exceptions
Exceptions require documented limitations and an online validation plan before broad deployment.

## Verification
Review evaluation datasets, metric code, baseline identifiers, confidence estimates, segment reports, and sampled error analysis.