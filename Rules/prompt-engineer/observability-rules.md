# Observability Rules

## Purpose
Make production prompt behavior diagnosable through evidence rather than guesswork.

## Scope
Prompt execution metadata, model responses, tool calls, evaluation signals, latency, cost, and failures.

## MUST
- Production workflows MUST record enough metadata to identify prompt version, model version, and relevant runtime configuration for significant failures.
- Logs and traces MUST distinguish model output, tool output, validation failures, and application-side failures.
- Monitoring MUST surface materially degraded success, safety, latency, or structured-output rates.
- Sensitive content in telemetry MUST be minimized, redacted, or access-controlled according to policy.

## MUST NOT
- MUST NOT log secrets or unrestricted sensitive user content merely for debugging convenience.
- MUST NOT infer root cause from aggregate metrics when request-level evidence is required.
- MUST NOT claim prompt regressions without comparing relevant versions and runtime conditions.

## SHOULD
- Key workflows SHOULD expose sliceable metrics by prompt version and model.
- Failure exemplars SHOULD be retained in a privacy-safe form for regression analysis.

## Exceptions
Telemetry may be reduced in privacy-sensitive contexts if equivalent diagnostic evidence is available through approved mechanisms.

## Verification
Inspect logs, traces, dashboards, redaction controls, and incident samples for sufficient versioned evidence.