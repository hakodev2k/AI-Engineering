# MySQL Security Hardening

## Purpose
Reduce MySQL attack surface and limit blast radius through layered database security controls.

## When to use
Use for new deployments, security reviews, exposure changes, credential incidents, or compliance work.

## Inputs
Topology, users/roles, network paths, TLS settings, authentication plugins, secrets handling, audit requirements.

## Context to inspect
Server version, exposed interfaces, grants, anonymous/test accounts, remote administration, encryption, backups, plugins, patch status.

## Core knowledge
Database security combines network isolation, strong authentication, least privilege, encryption, patching, auditing, and secure operational practices. Application authorization does not replace database authorization.

## Procedure
1. Inventory trust boundaries and database principals.
2. Restrict network exposure to required clients.
3. Enforce supported strong authentication and TLS.
4. Remove unused/default accounts and excessive grants.
5. Separate application, migration, monitoring, and administrative identities.
6. Protect credentials in a secrets system and rotate safely.
7. Review filesystem, backup, and key access.
8. Enable proportionate audit/security logging.
9. Patch supported versions through tested rollout.
10. Test denied as well as permitted access.

## Decision points
Use role-based grants when they simplify consistent least privilege. Require stronger isolation for administrative paths than application traffic.

## Common failure patterns
Wildcard hosts, shared admin credentials, application SUPER-like privileges, plaintext connections, secrets in config repositories, and audit logs containing sensitive values.

## Verification
Run grant review, connection/TLS checks, negative authorization tests, exposure scans, and credential-rotation rehearsal.

## Expected output
Hardened configuration and a documented access model with evidence.

## Stop conditions
Escalate if revoking access may break unknown production dependencies, credentials cannot be rotated safely, or required controls conflict with platform constraints.