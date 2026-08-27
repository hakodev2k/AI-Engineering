# Cryptographic Observability Rules

## Purpose
Make cryptographic failures and policy drift detectable without leaking secrets.

## Scope
Metrics, logs, alerts, audit events, and operational dashboards for cryptographic systems.

## MUST
- Emit actionable signals for verification failures, certificate expiry, key lifecycle events, unsupported algorithms, provider errors, and policy violations.
- Correlate events sufficiently for investigation while minimizing sensitive metadata.
- Define alert thresholds and ownership for conditions that threaten availability or trust.

## MUST NOT
- Log keys, plaintext secrets, passwords, raw authentication tokens, or sensitive cryptographic intermediate values.
- Suppress recurring cryptographic errors without root-cause review.

## SHOULD
- Track algorithm/version usage to support deprecation and migration decisions.

## Exceptions
Sensitive diagnostic capture requires explicit approval, access restriction, retention limits, and deletion.

## Verification
Inspect telemetry schemas, redaction tests, alerts, dashboards, incident exercises, and log samples.