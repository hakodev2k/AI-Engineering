# False Positive Control Rules

## Purpose
Prevent safety systems from causing disproportionate harm to legitimate users, creators, businesses, or communities through incorrect enforcement.

## Scope
Applies to detector thresholds, review quality, enforcement design, monitoring, and remediation for false positives.

## MUST
- False-positive risk MUST be explicitly measured for high-impact enforcement paths.
- Evaluation MUST include legitimate edge cases likely to resemble abuse, not only easy negatives.
- Irreversible or account-wide actions MUST require stronger confidence or additional review than reversible content-level actions.
- Systems MUST provide a containment path when false-positive rates exceed approved thresholds.
- Material false-positive regressions MUST block or roll back rollout unless an authorized owner accepts the documented risk.
- Reversal and complaint data MUST be used as production evidence, while accounting for selection bias.

## MUST NOT
- MUST NOT optimize recall without measuring the legitimate population harmed by additional detections.
- MUST NOT treat lack of appeals as proof that false positives are absent.
- MUST NOT use aggregate accuracy to conceal severe errors in small but high-impact cohorts.
- MUST NOT permanently penalize users based on a signal known to have unstable precision.

## SHOULD
- Thresholds SHOULD be risk-tiered by enforcement consequence.
- Sampling SHOULD oversample borderline decisions and new product surfaces.
- Teams SHOULD estimate user harm from false positives alongside harm from false negatives.

## Exceptions
During an imminent high-severity threat, temporarily stricter controls MAY be justified. The exception MUST define duration, affected surface, expected collateral impact, monitoring, human approval, and rollback conditions.

## Verification
Review confusion matrices, cohort-level error analysis, reversal rates, complaint trends, threshold documents, enforcement consequence mapping, and rollout gates. Confirm production rollback criteria include false-positive indicators.