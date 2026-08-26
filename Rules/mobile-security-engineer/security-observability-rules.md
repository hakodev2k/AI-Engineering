# Security Observability Rules

## Purpose
Make security-relevant mobile abuse and control failures detectable without creating new privacy or secret-exposure risks.

## Scope
Authentication anomalies, authorization failures, integrity signals, abuse indicators, security metrics, and alerts.

## MUST
- Define observable signals for high-impact security controls and abuse cases where server-side visibility is available.
- Correlate events using non-secret identifiers sufficient for investigation.
- Distinguish expected user errors from suspicious patterns to avoid unusable alert noise.
- Protect security telemetry from unauthorized access and excessive retention.

## MUST NOT
- Collect secrets or unnecessary sensitive payloads merely to improve investigations.
- Treat absence of alerts as proof that exploitation is absent.
- Automate irreversible enforcement from weak client integrity signals without a reviewed policy.

## SHOULD
- Establish baselines and thresholds using production evidence.
- Monitor material changes after security-control releases.

## Exceptions
Additional sensitive telemetry requires necessity, retention, access-control, privacy impact, and approval.

## Verification
Inspect event schemas, dashboards, alert logic, access controls, retention, test signals, and incident reconstruction exercises.