# Security and Tenant Isolation

## Purpose
Enforce authentication, authorization, tenant boundaries, network controls, and least privilege around vector data.

## When to use
Use for multi-tenant systems, security reviews, new integrations, or access incidents.

## Inputs
Identity model, tenant model, data classification, network topology, database roles, query APIs, and audit requirements.

## Context to inspect
Inspect credentials, RBAC/ABAC, namespace/collection layout, mandatory filters, service identities, TLS, private networking, audit logs, and admin paths.

## Core knowledge
Embeddings can encode sensitive source information and must inherit source-data protections. Application-provided tenant filters are insufficient if bypassable. Defense in depth combines identity, least privilege, storage boundaries, query enforcement, encryption, and auditability.

## Procedure
1. Classify vector, metadata, and payload sensitivity.
2. Map service/user identities to minimum required operations.
3. Enforce tenant boundary at the strongest available layer.
4. Validate every read/write path applies authorization consistently.
5. Restrict network exposure and require encrypted transport.
6. Store credentials in approved secret management and rotate them.
7. Separate administrative privileges from application identities.
8. Enable auditable security events without logging sensitive payloads.
9. Test cross-tenant negative cases and privilege escalation attempts.
10. Review backup/export paths for equivalent controls.

## Decision points
Use separate collections/databases/accounts when hard isolation or blast-radius reduction justifies operational cost; shared storage can be acceptable with enforceable tenant predicates and strong tests.

## Common failure patterns
Tenant ID accepted directly from caller; admin keys in apps; public endpoints by default; embeddings treated as non-sensitive; security filters applied after retrieval; backups less protected than primary data.

## Verification
Run negative authorization tests, credential-scope checks, network scans, audit-log review, and tenant-boundary tests across all APIs.

## Expected output
A least-privilege access model, isolation design, security tests, and remediation evidence.

## Stop conditions
Stop if authorization requirements are unresolved, security testing would access real unauthorized data, or privileged changes require approval.