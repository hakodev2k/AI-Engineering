# Uncertainty and Calibration Rules

## Purpose
Prevent confident presentation of unsupported AI conclusions in safety-relevant contexts.

## Scope
Applies to predictions, classifications, recommendations, generated claims, and automated decisions where uncertainty affects risk.

## MUST
- Define when uncertainty must be surfaced to users or downstream systems.
- Measure calibration or suitable confidence-quality relationships for safety-critical classifiers and gates.
- Escalate or abstain when evidence is insufficient for high-impact decisions.
- Distinguish model confidence signals from verified factual evidence.

## MUST NOT
- Present generated confidence language as calibrated probability without validation.
- Suppress uncertainty merely to improve perceived fluency.
- Automate high-impact decisions beyond validated confidence thresholds without approved controls.

## SHOULD
- Use selective prediction, abstention, or human review where error costs are asymmetric.
- Recalibrate after material model or distribution changes.

## Exceptions
Alternative uncertainty controls require evidence that they bound the relevant failure risk and documented approval.

## Verification
Review calibration plots or equivalent metrics, threshold tests, abstention behavior, escalation paths, and post-change recalibration evidence.
