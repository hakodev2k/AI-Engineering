# Provisioning Lead Time Rules
## Purpose
Trigger capacity actions early enough to avoid exhaustion.
## Scope
Hardware, cloud quotas, reservations, licenses, circuits, database scaling, and migrations.
## MUST
- Every material capacity action MUST have an estimated end-to-end lead time including approvals and validation.
- Action thresholds MUST trigger before forecast exhaustion by at least lead time plus safety margin.
- Long-lead resources MUST have named owners and tracked milestones.
## MUST NOT
- MUST NOT use vendor delivery time as the entire lead time when internal work remains.
- MUST NOT defer irreversible procurement solely on optimistic forecasts without scenario analysis.
## SHOULD
- Lead-time estimates SHOULD be calibrated from historical delivery data.
## Exceptions
Emergency procurement requires explicit risk and cost approval.
## Verification
Review historical cycle times, procurement records, milestones, and threshold calculations.