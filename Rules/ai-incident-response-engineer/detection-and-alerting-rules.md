# Detection and Alerting Rules

## Purpose
Ensure AI incidents are detected from meaningful operational and behavioral signals rather than only from user complaints.

## Scope
Applies to production AI services, models, prompts, agents, retrieval layers, safety controls, and external AI dependencies.

## MUST
- Detection MUST cover service health and AI-specific failure signals, including abnormal refusal rates, harmful-output indicators, tool failures, retrieval degradation, latency, error rates, and policy-control failures when relevant.
- Alert conditions MUST be tied to an expected response action, owner, and severity threshold.
- Alerting MUST distinguish user-impacting incidents from background noise sufficiently to support timely triage.
- Safety and security control failures MUST be observable independently from ordinary application success metrics.
- Monitoring changes that suppress or widen critical alerts MUST be reviewed before production activation.
- Detection evidence MUST preserve enough context to reproduce or bound the triggering behavior without unnecessarily storing sensitive content.

## MUST NOT
- Critical AI behavior MUST NOT depend exclusively on generic CPU, memory, or HTTP availability monitoring.
- Alert thresholds MUST NOT be changed merely to hide recurring incidents or reduce page volume without evidence.
- Sensitive prompts, credentials, tokens, or protected user data MUST NOT be indiscriminately copied into alert payloads.

## SHOULD
- Detection SHOULD combine metrics, structured events, model/evaluation signals, and user reports when appropriate.
- Teams SHOULD track alert precision, missed incidents, and time-to-detection and tune controls from evidence.

## Exceptions
When a signal cannot be monitored directly, the limitation, compensating signal, residual risk, and owner must be documented.

## Verification
Inspect monitoring configuration, alert routing, incident history, and test alerts. Verify that representative AI failure modes trigger actionable alerts and that sensitive data handling is compliant.