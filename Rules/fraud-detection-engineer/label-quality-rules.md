# Label Quality Rules

## Purpose
Protect fraud analytics and models from unreliable, delayed, biased, or ambiguous outcome labels.

## Scope
Confirmed fraud, disputes, chargebacks, abuse findings, investigator decisions, and derived labels.

## MUST
- Label definitions MUST specify source, maturity window, ambiguity handling, and known biases.
- Training and evaluation MUST account for label delay and incomplete outcomes.
- Manual-review labels MUST distinguish evidence-backed findings from uncertain dispositions.
- Label-definition changes MUST be versioned and impact-assessed.

## MUST NOT
- MUST NOT treat operational action as proof of fraud merely because a control blocked the event.
- MUST NOT mix materially different fraud outcomes without documented rationale.

## SHOULD
- Label precision SHOULD be audited using sampled evidence.
- Uncertain cases SHOULD remain explicitly uncertain rather than forced into binary truth.

## Exceptions
Require documented analytical rationale and sensitivity analysis.

## Verification
Inspect label contracts, maturity analysis, sampling audits, source lineage, version history, and evaluation datasets.