# Secrets and Configuration

## Purpose
Manage runtime configuration and secrets safely across environments and deployments.
## When to use
New configuration, secret rotation, external secret integration, or configuration incidents.
## Inputs
Configuration schema, secret sources, environment differences, rotation requirements, consumers.
## Context to inspect
ConfigMaps, Secrets, external secret controllers, encryption at rest, RBAC, volume/env injection, rollout behavior.
## Core knowledge
Kubernetes Secret encoding is not encryption. Secret confidentiality depends on etcd encryption, access controls, delivery path, logging discipline, and external KMS/secret stores.
## Procedure
1. Separate secret from non-secret configuration. 2. Define source of truth. 3. Validate schema and defaults. 4. Restrict access. 5. Choose env or volume delivery based on reload needs. 6. Implement rotation. 7. Prevent secret exposure in Git/logs. 8. Test missing/invalid/rotated values. 9. Document ownership.
## Decision points
Prefer external secret managers for centralized rotation/audit; use native Secrets when operational simplicity and controls are sufficient.
## Common failure patterns
Secrets committed to Git, broad read access, no rotation, hidden environment drift, unvalidated config, and assuming updates restart pods automatically.
## Verification
Scan repository/logs, test access boundaries, rotate a non-production secret, validate reload/rollout, and confirm encryption policy.
## Expected output
Auditable configuration and secret lifecycle with rotation evidence.
## Stop conditions
Escalate exposed credentials immediately or stop when secret source/owner is unknown.