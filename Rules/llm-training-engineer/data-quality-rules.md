# Training Data Quality Rules

## Purpose
Prevent low-quality, corrupted, duplicated, or misclassified data from dominating training behavior.

## Scope
Raw corpora, filtered datasets, tokenized shards, synthetic examples, labels, preference pairs, and final mixtures.

## MUST
- Data quality gates MUST be defined before large-scale training and MUST cover corruption, duplication, malformed records, language/domain validity, and label consistency where applicable.
- Filtering decisions MUST be measurable and reproducible from versioned code and configuration.
- Material dataset changes MUST be accompanied by distribution summaries and before/after quality evidence.
- Samples from both accepted and rejected data MUST be manually inspected for high-impact filters.
- Quality metrics MUST be stratified where aggregate metrics can hide weak domains or languages.

## MUST NOT
- MUST NOT assume larger datasets are better without evaluating noise and duplication.
- MUST NOT silently drop records because a parser or preprocessing stage failed.
- MUST NOT use a quality classifier outside its validated domain without checking failure behavior.

## SHOULD
- Deduplication SHOULD consider exact and near-duplicate content at document and example levels.
- Quality checks SHOULD detect template spam, encoding damage, contamination artifacts, and abnormal token distributions.

## Exceptions
A justified exception must document expected benefit, affected fraction, risks, and targeted evaluation.

## Verification
Review quality dashboards, filter configs, rejection reasons, sampled records, distribution reports, preprocessing error counters, and reproducibility tests.