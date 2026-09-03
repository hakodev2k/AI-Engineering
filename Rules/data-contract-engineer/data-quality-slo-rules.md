# Data Quality SLO Rules

## Purpose
Turn data quality expectations into measurable service commitments.

## Scope
Applies to freshness, completeness, validity, uniqueness, consistency, and availability expectations attached to shared data contracts.

## MUST
- Critical contracts MUST define measurable quality objectives relevant to consumer risk.
- Quality objectives MUST specify measurement method, evaluation window, and breach response.
- Threshold changes MUST be reviewed for consumer impact.
- Quality breaches affecting contract guarantees MUST be observable and assigned to an owner.

## MUST NOT
- Teams MUST NOT claim contract quality without measured evidence.
- Quality checks MUST NOT rely only on row counts when semantic correctness matters.
- Failed checks MUST NOT be silently disabled to keep pipelines green.

## SHOULD
- Objectives SHOULD focus on user-visible or decision-relevant failure modes.
- Alerting SHOULD distinguish transient anomalies from sustained SLO violations.

## Exceptions
Exceptions require reason, duration, consumer impact, compensating controls, and approval from the contract owner.

## Verification
Inspect quality monitors, historical SLO results, alert configuration, test definitions, and incident records for breaches.