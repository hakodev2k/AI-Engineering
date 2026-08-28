# Observability Security and Access

## Purpose
Protect telemetry systems and data with least privilege, tenant isolation, secure ingestion, and controlled query access.

## When to use
Use when onboarding tenants, reviewing permissions, exposing observability externally, or handling sensitive telemetry.

## Inputs
Identity model, tenant boundaries, data classification, backend permissions, network design, compliance controls.

## Context to inspect
Inspect authentication, authorization, service accounts, API tokens, TLS, tenancy filters, audit logs, and export destinations.

## Core knowledge
Understand RBAC/ABAC, tenant isolation, least privilege, credential rotation, encryption in transit/at rest, auditability, and data minimization.

## Procedure
1. Classify telemetry and identify sensitive fields.
2. Map human and machine access paths.
3. Define least-privilege roles by operational responsibility.
4. Enforce tenant boundaries at trusted platform layers.
5. Secure ingestion and export channels.
6. Rotate credentials and remove static shared secrets.
7. Audit administrative and sensitive-data access.
8. Test cross-tenant isolation and denied paths.
9. Document emergency-access procedures.

## Decision points
Use centralized policy when consistency matters; delegate bounded tenant administration when autonomy is required. Prefer short-lived identities over long-lived tokens.

## Common failure patterns
Shared admin accounts, dashboard-only access controls, secrets in collector configs, cross-tenant wildcard queries, and unlogged privilege escalation.

## Verification
Perform positive and negative authorization tests, credential-rotation tests, and audit-log review.

## Expected output
A verified access model with secure ingestion, tenancy, auditing, and emergency-access controls.

## Stop conditions
Stop if tenant boundaries, data classification, or identity ownership are undefined.