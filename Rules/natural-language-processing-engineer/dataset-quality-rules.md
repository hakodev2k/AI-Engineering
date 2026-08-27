# Dataset Quality Rules

## Purpose
Ensure NLP datasets are fit for the intended linguistic task and population.

## Scope
Collection, cleaning, deduplication, labeling, sampling, provenance, contamination, and dataset acceptance.

## MUST
- Every dataset MUST document source, license or permitted use, collection period, language/domain composition, label semantics, and known limitations.
- Train, validation, and test splits MUST be checked for exact and semantic leakage appropriate to the task.
- Label quality MUST be measured with adjudication or equivalent evidence for material ambiguity.
- Data transformations MUST be reproducible and versioned.

## MUST NOT
- MUST NOT treat dataset size as evidence of representativeness or quality.
- MUST NOT include prohibited, unlicensed, or sensitive data without an approved basis and controls.
- MUST NOT tune repeatedly against a supposedly untouched final test set.

## SHOULD
- Sampling SHOULD reflect production distributions or explicitly model intended deviations.
- Hard, rare, and safety-critical cases SHOULD receive targeted coverage.

## Exceptions
Departures require documented rationale, quantified bias or leakage risk, compensating evaluation, and approval where legal, privacy, or safety risk exists.

## Verification
Inspect provenance records, split-overlap reports, label agreement, class/language distributions, duplicate rates, transformation hashes, and representative samples before model training.