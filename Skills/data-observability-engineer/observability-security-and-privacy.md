# Observability Security and Privacy

## Purpose
Ensure data observability captures enough diagnostic evidence without leaking sensitive data, credentials, personal information, or restricted business content.

## When to use
Use when instrumenting pipelines, storing samples, logging failed records, integrating third-party observability tools, or granting access to telemetry.

## Inputs
Data classifications, security requirements, privacy obligations, telemetry schemas, access model, retention rules, vendor architecture.

## Preconditions
Sensitive-data classifications and approved storage boundaries must be known for critical systems.

## Context to inspect
Inspect logs, metric labels, trace attributes, anomaly samples, failed-record quarantine, dashboards, alert payloads, exports, retention, and user permissions.

## Core knowledge
Observability systems often become secondary data stores. Sensitive values can leak through query text, row samples, identifiers, payloads, URLs, exception messages, or high-cardinality dimensions. Least privilege and minimization apply to telemetry as strongly as production datasets.

## Procedure
1. Classify telemetry fields by sensitivity.
2. Identify paths where raw data enters logs, traces, alerts, or samples.
3. Remove unnecessary sensitive fields at instrumentation time.
4. Mask, tokenize, hash, or aggregate values when diagnostic utility permits.
5. Prevent credentials and secrets from entering telemetry.
6. Apply role-based access and environment separation.
7. Define retention and deletion aligned with policy.
8. Review third-party export boundaries and contractual controls.
9. Test redaction with representative failure payloads.
10. Audit access and periodically rescan telemetry for leakage.

## Decision points
Prefer omission over masking when a field is not needed. Hash only when linkability is required and risk is understood. Store raw samples only in approved restricted locations with short retention where possible.

## Common failure patterns
- Logging full failed records
- Secrets in connection-error messages
- Personal identifiers in metric labels
- Broad dashboard access
- Copying production telemetry into test systems

## Verification
Run automated secret and sensitive-pattern scans, inspect representative alerts and logs, and validate access controls with least-privilege test accounts.

## Expected output
A telemetry classification, redaction policy, access controls, retention rules, and verified leakage protections.

## Stop conditions
Stop and escalate on discovered credential leakage, unauthorized sensitive-data export, or requirements that conflict with legal or security policy.