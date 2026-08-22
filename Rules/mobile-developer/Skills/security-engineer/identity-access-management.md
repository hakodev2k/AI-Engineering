# Identity and Access Management

## Purpose
Design and review identity, authentication, authorization, and privilege models so access is explicit, least-privileged, auditable, and maintainable.

## When to use
Use for login systems, service identities, privileged operations, tenant isolation, role redesign, and integration access.

## Inputs
Actors, resources, permissions, identity providers, token flows, service topology, administrative roles, audit requirements.

## Context to inspect
Authentication protocols, authorization checks, token lifetime, claims, role mappings, service accounts, privileged paths, recovery flows, and break-glass access.

## Core knowledge
Authentication establishes identity; authorization determines allowed actions. Prefer resource-level authorization, least privilege, short-lived credentials, separation of duties, and explicit trust relationships.

## Procedure
1. Inventory human and workload identities.
2. Map resources and sensitive actions.
3. Define authentication strength per risk level.
4. Model authorization using roles, attributes, policies, or combinations.
5. Enforce authorization close to protected resources.
6. Minimize standing privileges and credential lifetime.
7. Design admin, recovery, and break-glass flows.
8. Define revocation, provisioning, and deprovisioning.
9. Add audit trails for privileged access.
10. Test horizontal and vertical privilege escalation scenarios.

## Decision points
Use RBAC when permissions align with stable job functions; ABAC/policy-based models when context and resource attributes materially affect access. Avoid excessive role explosion.

## Common failure patterns
UI-only authorization, trusting client claims without validation, shared service accounts, long-lived secrets, broad default roles, and missing deprovisioning.

## Verification
Permission tests cover allowed and denied paths, revoked access stops working, privileged actions are audited, and service identities have only necessary scopes.

## Expected output
An explicit IAM model with trust relationships, policies, lifecycle rules, auditability, and verification evidence.

## Stop conditions
Escalate when ownership of identities or permissions is unclear, or when privileged access changes require formal approval.