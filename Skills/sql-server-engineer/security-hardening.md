# SQL Server Security Hardening

## Purpose
Reduce SQL Server attack surface and privilege exposure while preserving operational functionality.

## When to use
Use for new deployments, security reviews, audits, privilege redesign, or hardening after incidents.

## Inputs
Identity model, roles, permissions, server configuration, network topology, encryption requirements, audit requirements.

## Context to inspect
Inspect logins/users, sysadmin membership, server/database permissions, service accounts, endpoints, TLS, encryption, SQL Agent proxies, linked servers, dangerous features, and auditing.

## Core knowledge
Least privilege must cover human identities, applications, automation, and service accounts. Database authorization should be role-oriented and auditable; secrets and credentials require lifecycle controls.

## Procedure
1. Inventory identities and privilege paths.
2. Remove unused logins and excessive server roles.
3. Map application permissions to least-privilege database roles.
4. Separate administrative duties.
5. Harden network exposure and require protected connections.
6. Review dangerous features and external integrations.
7. Protect credentials, keys, and certificates.
8. Enable appropriate auditing.
9. Test application and operational workflows.
10. Establish periodic access review.

## Decision points
Prefer integrated/federated identity where supported; use SQL authentication only where justified. Grant object/schema permissions through roles rather than individual users when practical.

## Common failure patterns
Application accounts as db_owner, shared admin credentials, orphaned principals, excessive EXECUTE AS, weak linked-server mappings, and unaudited privilege escalation.

## Verification
Run permission tests for allowed and denied actions, review effective privileges, validate TLS/encryption, and confirm audit events.

## Expected output
Hardened configuration, access matrix, exceptions, and verification evidence.

## Stop conditions
Stop when permission removal may break critical workloads and ownership/testing evidence is unavailable.