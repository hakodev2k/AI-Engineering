# Training Data Rules

## Purpose
Ensure recommendation models train on trustworthy, temporally valid, and policy-compliant data.

## Scope
Applies to interaction logs, labels, negatives, sampled datasets, joins, and derived training examples.

## MUST
- Training datasets MUST define prediction timestamp, label window, eligibility criteria, and sampling logic.
- Joins MUST be point-in-time correct for features that can change after the prediction event.
- Negative sampling MUST preserve the intended learning problem and document sampling bias.
- Data quality checks MUST cover nulls, schema drift, volume anomalies, duplicate events, and label distribution changes.
- Training data lineage MUST identify source datasets and transformation versions.

## MUST NOT
- MUST NOT use post-outcome information that would be unavailable at inference time.
- MUST NOT silently drop failed partitions or malformed examples when doing so can bias training.
- MUST NOT reuse production-sensitive data outside its authorized purpose.

## SHOULD
- Sampling strategies SHOULD be compared for bias and variance effects.
- Dataset snapshots SHOULD be reproducible for important releases.

## Exceptions
Exceptions require documented reason, quantified impact, and review for leakage, bias, or privacy risk.

## Verification
Inspect dataset specifications, point-in-time tests, lineage records, distribution reports, and reproducibility artifacts.