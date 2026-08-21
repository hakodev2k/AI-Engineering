# Identity and Access Architecture

## Purpose
Design consistent authentication, authorization, identity lifecycle, federation, and service-to-service access across a solution.

## When to use
Use for SSO, APIs, B2B/B2C access, multi-tenant systems, privileged administration, and service identities.

## Inputs
Actors, identity providers, tenancy model, authorization requirements, federation needs, audit requirements.

## Preconditions
Trust boundaries and protected resources are identified.

## Context to inspect
OIDC/OAuth flows, directory systems, claims, roles, policies, token lifetimes, service principals, managed identity, provisioning/deprovisioning.

## Core knowledge
Authentication proves identity; authorization decides allowed actions. Prefer policy/resource-based authorization over scattering role checks. Service identities should be independent from human credentials.

## Procedure
1. Classify human, service, partner, and administrator identities.
2. Choose authoritative identity providers.
3. Define authentication protocols and token audiences.
4. Model authorization around resources and actions.
5. Define tenant isolation where applicable.
6. Design provisioning, deprovisioning, and access reviews.
7. Minimize privileges and credential lifetime.
8. Define service-to-service identity.
9. Design emergency/admin access and auditability.
10. Test token misuse, stale access, tenant crossing, and privilege escalation scenarios.

## Decision points
Prefer federation over duplicated credentials. Use roles for coarse grouping and policies/claims for context-sensitive authorization when justified.

## Common failure patterns
Role explosion, authorization only in UI, shared service accounts, long-lived secrets, missing deprovisioning, tenant ID trusted from client input.

## Verification
Access tests prove least privilege and isolation across representative identities.

## Expected output
Identity architecture and authorization model with lifecycle controls.

## Stop conditions
Stop when identity ownership or tenant-isolation policy is unresolved.