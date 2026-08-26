# Decision Threshold Rules

## Purpose
Set fraud thresholds using measurable risk, economics, customer impact, and capacity constraints.

## Scope
Score cutoffs and thresholds driving allow, challenge, review, hold, or deny actions.

## MUST
- Thresholds MUST be justified with current outcome data and decision-cost trade-offs.
- Threshold evaluation MUST include false positives, fraud loss, review volume, and downstream customer impact.
- Threshold changes MUST define expected movement, monitoring, and rollback triggers.
- Segment-specific thresholds MUST have evidence that segmentation improves outcomes without prohibited discrimination.

## MUST NOT
- MUST NOT tune thresholds on the final evaluation set and report that same set as unbiased evidence.
- MUST NOT copy thresholds between populations without validation.

## SHOULD
- Thresholds SHOULD be recalibrated when prevalence, score calibration, costs, or operational capacity materially changes.

## Exceptions
Emergency changes require bounded scope, approval, monitoring, and retrospective evaluation.

## Verification
Review ROC/PR and cost analyses, calibration, segment metrics, change approvals, rollout dashboards, and rollback evidence.