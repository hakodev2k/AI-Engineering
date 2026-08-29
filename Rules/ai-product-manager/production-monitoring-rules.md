# Production Monitoring Rules

## Purpose
Ensure launched AI products are monitored for quality, safety, reliability, cost, and behavior change.

## Scope
Applies to production telemetry, model behavior monitoring, alerts, and post-launch review.

## MUST
- Monitoring MUST cover user-impact metrics, model-quality indicators, safety guardrails, latency, errors, and material cost drivers where relevant.
- Alert thresholds MUST map to an owner and response action.
- Critical slices and known failure modes MUST be monitored separately when aggregate metrics can hide degradation.
- Material behavior changes after model, prompt, policy, or data updates MUST be detectable.

## MUST NOT
- MUST NOT rely on support tickets as the primary detection mechanism for severe product failures.
- MUST NOT collect monitoring data without a defined purpose or retention policy.
- MUST NOT suppress recurring alerts without addressing root cause or formally accepting the risk.

## SHOULD
- Monitoring SHOULD compare current behavior with a stable baseline.
- Product reviews SHOULD include drift, incident, and user-feedback trends.

## Exceptions
Exceptions require documented observability gaps, residual risk, temporary controls, and a remediation deadline.

## Verification
Inspect dashboards, alert definitions, ownership, telemetry schemas, incident history, and post-launch review records.