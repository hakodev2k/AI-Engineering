# PKI Monitoring and Audit

## Purpose
Provide evidence that certificate services, keys, policies, and trust relationships remain healthy and compliant.

## Scope
Applies to CA activity, certificate inventory, key operations, expiry, revocation, trust stores, and control evidence.

## MUST
- PKI systems MUST log security-relevant administrative, signing, issuance, revocation, and policy-change events.
- Monitoring MUST detect unexpected issuance, approaching expirations, status-service failures, trust-store drift, and critical key-access anomalies.
- Audit records MUST be protected from unauthorized modification and retained according to policy.
- Alerts MUST identify an accountable response path and be tested periodically.

## MUST NOT
- MUST NOT log private keys, secret values, recovery material, or sensitive authentication tokens.
- MUST NOT rely on CA availability monitoring alone as evidence that certificate consumers remain healthy.
- MUST NOT suppress repeated certificate or trust failures without root-cause review.

## SHOULD
- Correlate issuance and deployment data to identify orphaned or unused certificates.
- Trend certificate lifecycle and failure metrics to find systemic risks.

## Exceptions
Require documented monitoring gap, compensating evidence, owner, remediation date, and approval.

## Verification
Inspect audit configuration, sample logs, alert rules, retention controls, dashboards, test alerts, endpoint scans, and reconciliation reports.