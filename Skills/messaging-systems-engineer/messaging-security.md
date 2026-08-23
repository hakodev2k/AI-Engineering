# Messaging Security

## Purpose
Protect broker access, message confidentiality, integrity and tenant boundaries with least privilege.

## When to use
Use when designing or reviewing production messaging security.

## Inputs
Identities, topology, data classification, network model, compliance and key-management requirements.

## Context to inspect
Authentication, ACLs/RBAC, TLS, secrets, encryption, audit logs and administrative access.

## Core knowledge
Broker permissions should separate produce, consume and administration. Payload encryption does not replace transport security or access control.

## Procedure
1. Classify message data.
2. Map identities to required operations.
3. Apply least-privilege topic/queue permissions.
4. Require authenticated encrypted transport.
5. Protect credentials with managed secret/key systems.
6. Define rotation and revocation.
7. Restrict management plane access.
8. Audit authorization failures and privileged changes.

## Decision points
Use payload-level encryption when intermediaries must not read sensitive fields or policy requires it.

## Common failure patterns
Shared credentials, wildcard ACLs, secrets in payload/logs and unrestricted broker administration.

## Verification
Test denied operations, credential rotation and encrypted connections; review audit evidence.

## Expected output
A least-privilege messaging security model.

## Stop conditions
Escalate unresolved compliance, key ownership or cross-tenant isolation requirements.