# Drift Monitoring Rules

## Purpose
Detect changes in traffic, fraud tactics, data quality, and model behavior before they create material loss or harm.

## Scope
Features, scores, labels, fraud prevalence, decision rates, and operational outcomes.

## MUST
- Critical fraud systems MUST monitor input quality, score/decision distributions, outcome metrics, and material segment shifts.
- Alerts MUST define actionable thresholds, ownership, and investigation expectations.
- Drift investigations MUST distinguish data-pipeline faults from genuine behavioral change.
- Monitoring MUST account for outcome-label delay.

## MUST NOT
- MUST NOT retrain or retune automatically from drift signals without validated safeguards and authority.
- MUST NOT treat distribution change alone as proof of model degradation.

## SHOULD
- Drift baselines SHOULD account for known seasonality and product changes.
- Alert thresholds SHOULD be tuned against historical incidents and noise.

## Exceptions
Reduced monitoring requires documented low-risk rationale and compensating checks.

## Verification
Inspect dashboards, alert definitions, incident records, delayed-outcome logic, baseline methodology, and response runbooks.