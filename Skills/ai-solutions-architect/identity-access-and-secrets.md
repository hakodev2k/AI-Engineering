# Identity, Access, and Secrets Architecture

## Purpose
Define how users, services, agents, tools, and providers are identified and authorized without relying on model judgment for access decisions.

## When to use
Use whenever the AI solution accesses protected data, invokes tools, calls internal APIs, or operates across multiple tenants or security domains.

## Inputs
Identity providers, roles, resource boundaries, service identities, tenancy model, tool permissions, provider integrations, and audit requirements.

## Context to inspect
Inspect existing SSO, service-to-service authentication, authorization policies, secret-management platform, network boundaries, and resource ownership.

## Core knowledge
Authentication proves identity; authorization decides allowed actions. AI components should receive the least authority needed for a bounded task. Secrets belong in managed secret stores and workload identity systems, not prompts, source code, logs, or model memory.

## Procedure
1. Enumerate human and machine actors.
2. Map each actor to required resources and actions.
3. Define least-privilege roles and tenant boundaries.
4. Keep authorization enforcement in deterministic services.
5. Prefer short-lived workload identities over static secrets.
6. Define secret storage, rotation, and revocation.
7. Prevent sensitive credentials from entering model context or logs.
8. Propagate caller identity where downstream authorization depends on it.
9. Audit privileged actions and denied access.
10. Test cross-role and cross-tenant isolation.

## Decision points
Use delegated user identity when actions must reflect user authority; use service identity for system-owned work. Separate read and write capabilities when operationally possible.

## Common failure patterns
Shared service accounts, broad tool permissions, credentials embedded in prompts, authorization based on generated text, and weak tenant isolation.

## Verification
Access tests demonstrate allowed and denied paths, secret scanning finds no exposed credentials, and audit trails identify the acting principal.

## Expected output
An identity and access design with actors, roles, trust boundaries, credential lifecycle, and verification evidence.

## Stop conditions
Stop when ownership of privileged actions is unclear, tenant isolation cannot be enforced, or required credentials cannot be managed safely.