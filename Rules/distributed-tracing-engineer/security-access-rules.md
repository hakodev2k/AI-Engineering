# Trace Security and Access Rules

## Purpose
Protect tracing infrastructure and telemetry from unauthorized access, tampering, and misuse.

## Scope
Applies to SDK credentials, collector identities, backend access, tenant isolation, encryption, and administrative actions.

## MUST
- Trace exporters and collectors MUST authenticate using managed identities or securely stored credentials with least privilege.
- Trace data MUST use approved encryption in transit and at rest where required by platform policy.
- Backend access MUST be role-based and auditable for production telemetry.
- Multi-tenant routing and queries MUST enforce tenant boundaries before data reaches users.
- Credential rotation and revocation procedures MUST be documented for tracing infrastructure.

## MUST NOT
- MUST NOT embed backend tokens or collector secrets in source code, images, or client-delivered applications.
- MUST NOT grant broad write or administrative access merely to enable trace viewing.
- MUST NOT weaken certificate validation or authentication to resolve telemetry delivery failures without explicit security approval.

## SHOULD
- Separate read, ingest, configuration, and administrative privileges.
- Audit anomalous bulk exports and sensitive query patterns where supported.

## Exceptions
Exceptions require threat assessment, compensating controls, bounded duration, accountable owner, and explicit approval.

## Verification
Inspect IAM policies, secret stores, TLS configuration, audit logs, tenant isolation tests, and credential scanning results.
