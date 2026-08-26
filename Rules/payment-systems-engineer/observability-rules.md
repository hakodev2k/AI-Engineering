# Payment Observability Rules

## Purpose
Make payment behavior diagnosable without exposing sensitive data.

## Scope
Logs, metrics, traces, alerts, dashboards, and operational correlation across payment services and providers.

## MUST
- Every payment operation MUST carry stable correlation identifiers across internal services and provider boundaries where possible.
- Metrics MUST distinguish business outcomes such as authorized, declined, failed, retried, refunded, disputed, and indeterminate.
- Alerts MUST focus on actionable financial or reliability conditions, including elevated failures, reconciliation breaks, and processing backlog.
- Logs and traces MUST preserve diagnostic context while redacting prohibited or secret values.
- Observability data MUST allow operators to separate provider degradation from internal application failure.

## MUST NOT
- MUST NOT log full payment credentials, secrets, or prohibited sensitive cardholder data.
- MUST NOT rely on aggregate success rate alone when partial regional, currency, or provider failures are possible.
- MUST NOT claim incident resolution without evidence from current telemetry.

## SHOULD
- Dashboards SHOULD include latency percentiles, provider error classes, retry rates, queue age, and reconciliation health.

## Exceptions
Exceptions require security review and alternative evidence collection.

## Verification
Inspect sample traces, redaction tests, dashboards, alert routes, incident queries, and provider-vs-internal breakdowns.