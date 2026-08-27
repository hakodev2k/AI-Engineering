# Observability Rules

## Purpose
Make production quantitative behavior diagnosable without exposing sensitive data.

## Scope
Applies to live models, data pipelines, pricing, risk, optimization, and trading services.

## MUST
- Critical services MUST expose health, latency, error, freshness, throughput, and domain-quality metrics appropriate to their function.
- Model version, data version, configuration version, and correlation identifiers MUST be available for reconstructing material decisions.
- Alerts MUST distinguish infrastructure failure from data or model-quality degradation where possible.
- Logs MUST preserve diagnostic context while redacting secrets, credentials, personal data, and restricted market data as required.
- Monitoring thresholds MUST have an owner and operational response.

## MUST NOT
- Successful process execution MUST NOT be treated as proof that quantitative outputs are valid.
- Secrets, authentication tokens, or sensitive position/order data MUST NOT be logged indiscriminately.
- High-cardinality telemetry MUST NOT threaten service availability without controls.

## SHOULD
- Monitor input and output distributions for material drift.
- Link alerts to runbooks and relevant dashboards.

## Exceptions
Exceptions require documented observability gap, compensating evidence, risk acceptance, and remediation plan.

## Verification
Inspect dashboards, alert tests, log samples, redaction checks, traceability from outputs to versions, synthetic failures, and incident records showing telemetry supports diagnosis.