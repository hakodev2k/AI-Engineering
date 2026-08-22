# Telemetry Security and Privacy

## Purpose
Prevent observability systems from becoming a secondary source of secrets, personal data, or unauthorized operational information.

## When to use
Use when designing telemetry schemas, onboarding a service, changing retention, or reviewing access and compliance risk.

## Inputs
Data-classification policy, telemetry schemas, access model, retention, encryption, regulatory requirements, and incident history.

## Context to inspect
Inspect payload logging, headers, query parameters, user identifiers, tokens, database statements, exporter transport, backend permissions, and audit logs.

## Core knowledge
Telemetry often crosses trust boundaries and is broadly searchable. Minimize collection before relying on redaction. Redaction must occur before sensitive data reaches uncontrolled processors or exporters.

## Procedure
1. Classify telemetry fields by sensitivity.
2. Remove unnecessary sensitive collection.
3. Redact or hash approved identifiers where required.
4. Block credentials, tokens, and secret payloads.
5. Encrypt telemetry in transit and at rest where supported.
6. Apply least-privilege backend access.
7. Define retention and deletion rules.
8. Audit access to sensitive datasets.
9. Test redaction with representative inputs.

## Decision points
Prefer omission over masking when data has no operational value. Use pseudonymous identifiers only when correlation value justifies residual privacy risk.

## Common failure patterns
Logging authorization headers, secrets in exception objects, redacting after export, broad admin access, and indefinite retention.

## Verification
Run automated and manual sensitive-data tests and confirm restricted users cannot access protected telemetry.

## Expected output
A minimized, access-controlled, auditable telemetry data model.

## Stop conditions
Escalate when legal interpretation, data residency, or regulated-data handling requires specialist approval.