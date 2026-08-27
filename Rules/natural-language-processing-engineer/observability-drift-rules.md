# Observability and Drift Rules

## Purpose
Detect production degradation, distribution shift, and unexplained NLP behavior promptly.

## Scope
Logs, metrics, traces, input/output distributions, model quality proxies, drift, alerts, and diagnostics.

## MUST
- Production NLP services MUST expose health, latency, error, saturation, and version telemetry appropriate to their criticality.
- Drift monitoring MUST use features or proxies whose interpretation and limitations are documented.
- Alerts MUST be actionable and tied to an owner or response path.
- Observability MUST preserve privacy and security constraints on text and model outputs.

## MUST NOT
- MUST NOT log raw sensitive text by default merely for debugging convenience.
- MUST NOT equate statistical drift automatically with quality degradation or absence of drift with correctness.
- MUST NOT create alerts with no defined response action.

## SHOULD
- Monitoring SHOULD segment critical languages, domains, classes, and model versions.
- Offline quality checks SHOULD be triggered when drift or proxy metrics cross validated thresholds.

## Exceptions
Reduced telemetry requires documented constraints, alternative evidence, and accepted operational risk.

## Verification
Inspect dashboards, alert routing, privacy-safe logging, drift backtests, version segmentation, incident evidence, and periodic correlation between proxies and measured quality.