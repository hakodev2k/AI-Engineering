# Security Logging and Auditability

## Purpose
Design audit evidence that supports accountability, incident investigation, control verification, and compliance without exposing secrets or unnecessary sensitive data.

## When to use
Use when building or reviewing authentication, authorization, administrative operations, sensitive-data access, and security-sensitive workflows.

## Inputs
Threat model, privileged actions, data classification, identity model, retention requirements, logging platform, investigation needs.

## Context to inspect
Application logs, identity events, administrative changes, cloud audit records, correlation identifiers, retention settings, access controls, and redaction rules.

## Core knowledge
High-value audit records should capture actor, action, target, time, result, and relevant context. Audit trails must be protected from unauthorized alteration and should avoid storing credentials, tokens, or excessive personal data.

## Procedure
1. Identify security-sensitive actions and investigation questions.
2. Define required audit fields and stable identifiers.
3. Capture successful and denied privileged actions where useful.
4. Correlate events across services and identity systems.
5. Redact secrets and minimize unnecessary sensitive values.
6. Restrict access to audit data and separate administrative responsibilities where appropriate.
7. Define retention and integrity controls.
8. Create operational views or searches for common investigations.
9. Exercise representative events and verify evidence completeness.
10. Review audit gaps after incidents and architecture changes.

## Decision points
Record enough context to reconstruct security-relevant activity, but avoid indiscriminate payload logging. Apply stronger retention and integrity controls to high-value audit trails.

## Common failure patterns
Missing actor identity, logs without correlation, secret leakage, no audit for privilege changes, inconsistent clocks, uncontrolled log access, and insufficient retention.

## Verification
Representative privileged and denied operations produce complete audit records, secrets are absent, correlation works, and unauthorized users cannot alter or access protected audit data.

## Expected output
A secure audit design with defined events, fields, retention, access boundaries, and verification evidence.

## Stop conditions
Escalate when audit requirements conflict with privacy or legal obligations, or when evidence preservation is required for an active investigation.