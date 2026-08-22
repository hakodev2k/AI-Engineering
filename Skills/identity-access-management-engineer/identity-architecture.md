# Identity Architecture

## Purpose
Design identity boundaries, principals, trust relationships, and lifecycle flows that make access decisions explicit, auditable, and resilient.

## When to use
Use when designing or reviewing workforce, customer, service, workload, or federated identity systems; introducing a new identity provider; or changing trust boundaries.

## Inputs
Architecture diagrams, identity providers, applications, directories, protocols, trust requirements, user populations, regulatory constraints, and current incidents.

## Preconditions
Identify authoritative identity sources and distinguish human, service, device, and workload identities.

## Context to inspect
Inspect authentication flows, directories, federation, token issuers, provisioning paths, privileged identities, service accounts, tenancy boundaries, and recovery paths.

## Core knowledge
Identity is a security control plane. Strong architecture separates proof of identity from authorization, minimizes transitive trust, uses explicit trust anchors, and accounts for lifecycle, compromise, recovery, and machine identities.

## Procedure
1. Inventory identity types and authoritative sources.
2. Map trust boundaries and token/credential flows.
3. Identify relying parties and required claims.
4. Define authentication assurance requirements.
5. Define provisioning, deprovisioning, and recovery flows.
6. Minimize identity duplication and implicit trust.
7. Design high-availability and break-glass paths.
8. Define audit events and ownership.
9. Threat-model federation, recovery, and privileged paths.
10. Document decisions and residual risks.

## Decision points
Prefer federation over duplicated credentials when trust can be governed. Prefer centralized policy where consistency matters, but avoid a single operational dependency without recovery design.

## Common failure patterns
Orphaned identities, shared accounts, circular trust, unclear source of truth, permanent service credentials, weak recovery, and authorization embedded in authentication logic.

## Verification
Trace representative human and workload identities from creation through authentication, authorization, rotation, disablement, and deletion. Validate failure and recovery scenarios.

## Expected output
An identity architecture with explicit sources of truth, trust boundaries, protocols, lifecycle flows, ownership, controls, and risks.

## Stop conditions
Escalate when authoritative identity ownership is unresolved, required trust cannot be validated, or a change could lock out critical administrators.