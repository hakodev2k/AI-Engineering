# PKI Observability and Alerting Rules

## Purpose
Detect lifecycle, availability, policy, and trust failures before they become outages or security incidents.

## Scope
CA services, HSMs, OCSP/CRL, enrollment, certificate populations, and trust changes.

## MUST
- Monitoring MUST cover expiry margin, issuance failures, revocation freshness, CA/HSM health, and abnormal issuance volume.
- Alerts MUST map to an owner, severity, response action, and actionable evidence.
- Critical certificate-path failures MUST be tested end-to-end rather than inferred only from component health.
- Telemetry MUST avoid exposing private keys, PINs, tokens, or unnecessary sensitive identity data.

## MUST NOT
- MUST NOT suppress persistent PKI alerts without documented root cause or accepted risk.
- MUST NOT claim availability from dashboard status alone when synthetic validation is feasible.
- MUST NOT log enrollment secrets.

## SHOULD
- SLOs SHOULD reflect user-visible issuance and validation outcomes.

## Exceptions
Monitoring gaps require risk, owner, compensating detection, and deadline.

## Verification
Review alerts, synthetic probes, dashboards, log redaction, incident history, and alert-routing tests.