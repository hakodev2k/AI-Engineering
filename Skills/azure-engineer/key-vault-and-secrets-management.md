# Key Vault and Secrets Management

## Purpose
Protect application secrets, certificates, and cryptographic keys while minimizing secret distribution and operational exposure.

## When to use
Use when applications require credentials, certificates, encryption keys, signing material, or secret rotation.

## Inputs
Secret consumers, identity model, rotation requirements, network restrictions, recovery requirements, and compliance constraints.

## Context to inspect
Inspect Key Vaults, RBAC/access policies, private endpoints, purge protection, soft delete, diagnostic settings, secret references, certificates, keys, and application configuration.

## Core knowledge
The safest secret is one not stored by the application. Prefer managed identity and workload federation where supported. Vault authorization, network access, recovery settings, and rotation are separate control layers.

## Procedure
1. Inventory sensitive credentials and identify opportunities to eliminate them.
2. Classify remaining values as secrets, certificates, or cryptographic keys.
3. Choose vault boundaries based on environment, ownership, blast radius, and access patterns.
4. Enable soft delete and appropriate purge protection.
5. Grant least-privilege access to workload identities.
6. Restrict network access where required and validate DNS.
7. Integrate applications without copying values into source control or deployment logs.
8. Define rotation and certificate-renewal workflows.
9. Enable auditing and alerts for sensitive operations.
10. Test recovery, rotation, and application behavior after secret change.

## Decision points
Use separate vaults when isolation and ownership justify operational overhead. Use keys in Key Vault or Managed HSM when key custody and cryptographic operations must remain controlled rather than exporting key material.

## Common failure patterns
Secrets in appsettings or pipeline variables without need, broad vault-reader access, no rotation owner, disabling recovery safeguards, logging secret values, and private endpoints with broken DNS.

## Verification
Rotate a non-production credential, confirm consumers recover correctly, validate denied access from unauthorized identities, and inspect audit logs.

## Expected output
A least-privilege secret-management design with automated consumption, rotation, recovery, and audit evidence.

## Stop conditions
Stop when migration would invalidate production credentials without rollback, key custody requirements are unclear, or required recovery controls cannot be enabled.