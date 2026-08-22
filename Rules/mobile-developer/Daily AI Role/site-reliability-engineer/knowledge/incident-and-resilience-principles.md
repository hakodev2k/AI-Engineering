# Incident and Resilience Principles

## Stabilization Before Explanation
During active impact, restoration generally outranks perfect diagnosis. Choose reversible actions that reduce impact while preserving evidence.

## Evidence Discipline
Maintain separate fields for fact, hypothesis, test, result, and conclusion. Time correlation is not causation.

## Resilience Design
Evaluate timeout, retry, idempotency, backpressure, queue growth, circuit breaking, failover, graceful degradation, isolation, and recovery time. Retries multiply load; always include limits and jitter where applicable.

## Blast Radius
Prefer segmented rollout, tenant/region isolation, feature controls, and bounded permissions. A small failure domain converts unknown failure modes into survivable incidents.

## Recovery
Backups protect only if restore is feasible within recovery expectations. Define RPO/RTO where the business impact warrants it and test recovery paths.

## Alerting
Page only when a human must act now. Ticket non-urgent degradations. Dashboard informational signals. Alerts without decisions become toil.

## Post-Incident Work
Prioritize systemic contributors, detection gaps, failed safeguards, and recovery friction. Avoid action-item inflation; each item needs owner, outcome, and verification.