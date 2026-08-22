# Security Across Service Boundaries

## Purpose
Protect identities, authorization decisions, data, and trust boundaries across distributed service-to-service communication.

## When to use
Use for new services, external/internal integrations, multi-tenant systems, privileged workflows, and network-boundary changes.

## Inputs
Identity model, authorization rules, data classification, service topology, protocols, and secrets/certificate management.

## Context to inspect
Inspect authentication tokens, workload identities, TLS, gateways, service accounts, permissions, secret stores, logs, and tenant boundaries.

## Core knowledge
Network location is not identity. Each service should authenticate callers and authorize actions at the boundary it owns. Credentials need least privilege, rotation, bounded lifetime, and auditable use.

## Procedure
1. Map trust boundaries and sensitive data flows.
2. Identify human and workload identities.
3. Define authentication at each remote boundary.
4. Define authorization close to the protected resource/action.
5. Minimize service permissions and credential lifetime.
6. Encrypt sensitive traffic and stored secrets appropriately.
7. Propagate user context only when required and without trusting mutable client claims.
8. Protect against confused-deputy and cross-tenant access.
9. Add audit events for privileged operations.
10. Test denied, expired, replayed, and cross-tenant scenarios.

## Decision points
Use delegated user identity when downstream authorization genuinely depends on the user; use workload identity for service-owned operations. Avoid sharing broad static credentials.

## Common failure patterns
Trusting internal IPs, authorization only at gateway, forwarding oversized tokens everywhere, shared administrator service accounts, and sensitive claims in logs.

## Verification
Perform negative authorization tests, credential-rotation tests, tenant-isolation tests, and audit-log review.

## Expected output
A least-privilege cross-service security model with verified trust boundaries.

## Stop conditions
Escalate when identity ownership is unclear, required permissions are excessive, or regulated data handling lacks approved controls.