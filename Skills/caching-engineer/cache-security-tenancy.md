# Cache Security and Tenancy

## Purpose
Prevent cached data from crossing authorization, tenant, privacy, or trust boundaries.

## When to use
Use for multi-tenant caches, authenticated response caching, shared infrastructure, or security reviews.

## Inputs
Data classification, authorization model, tenant identity, cache topology, encryption requirements.

## Context to inspect
Inspect key construction, network access, ACLs, TLS, credentials, logs, backups/snapshots, and response cache headers.

## Core knowledge
Caches can bypass authorization if identity-dependent representations share keys. Shared infrastructure needs least privilege, network isolation, credential rotation, encryption in transit where required, and safe logging. Cache contents should be considered recoverable copies of sensitive data and governed accordingly.

## Procedure
1. Classify cached data.
2. Determine which authorization dimensions alter representation.
3. Encode tenant/security scope into keys or isolate stores.
4. Restrict network and credential access.
5. Enable transport protection and at-rest controls as required.
6. Set retention/TTL consistent with privacy obligations.
7. Prevent secrets and raw PII in keys/logs.
8. Test cross-tenant and privilege-change scenarios.
9. Define credential rotation and incident purge procedures.
10. Review administrative interfaces and backups.

## Decision points
Prefer physical/logical isolation for high-risk tenants or regulated data when shared-key controls are insufficient. Do not cache sensitive responses if safe invalidation and access control cannot be guaranteed.

## Common failure patterns
User-specific response under URL-only key; shared admin credentials; public cache endpoint; PII in keys; stale permissions after role change.

## Verification
Run authorization boundary tests and infrastructure access review; verify purge after privilege revocation.

## Expected output
A threat-reviewed cache design with enforced tenant boundaries.

## Stop conditions
Stop and escalate on unresolved cross-tenant exposure or unclear data-classification requirements.