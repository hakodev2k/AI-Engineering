# Security and Access Control

## Purpose
Protect distributed databases through least privilege, authenticated transport, secret hygiene, and auditable administrative boundaries.

## When to use
Use for security reviews, new deployments, privilege changes, credential incidents, or compliance preparation.

## Inputs
Identity model, data classification, network topology, roles, encryption capabilities, audit requirements.

## Context to inspect
Database users/roles, service identities, TLS settings, network policies, secrets, key management, audit logs, backups, and admin workflows.

## Core knowledge
Database security spans control plane, data plane, backups, replication links, and operational tooling. Shared admin credentials and broad network trust increase blast radius. Encryption is ineffective if key access is equally broad.

## Procedure
1. Classify data and privileged operations.
2. Inventory human and workload identities.
3. Remove shared and unused credentials.
4. Define least-privilege roles by operation.
5. Require authenticated encrypted connections.
6. Restrict network paths and administrative endpoints.
7. Store and rotate secrets through approved systems.
8. Protect backups and encryption keys separately.
9. Enable immutable-enough audit trails.
10. Test denied as well as allowed access.

## Decision points
Prefer workload identity or short-lived credentials over static secrets. Separate break-glass access from routine administration.

## Common failure patterns
Wildcard roles, plaintext replication, credentials in configuration repositories, unaudited superuser access, and backups with weaker controls than primary data.

## Verification
Run permission tests, certificate validation, secret scans, audit-event checks, and access reviews against intended policy.

## Expected output
A least-privilege role model, protected connectivity, secret/key controls, audit coverage, and evidence of enforcement.

## Stop conditions
Escalate if required access conflicts with policy, key ownership is unclear, or remediation could lock out production without a tested recovery path.