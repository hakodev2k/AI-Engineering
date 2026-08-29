# Identity and Access Design

## Purpose
Design authentication, authorization, service identity, and administrative access that fit the customer's identity ecosystem and least-privilege requirements.

## When to use
Use for enterprise integrations, multi-user platforms, APIs, and production deployment design.

## Inputs
Identity providers, actor types, roles, protocols, permission model, lifecycle requirements.

## Context to inspect
SSO, federation, MFA, service accounts, token lifetimes, provisioning, revocation, tenant boundaries, and break-glass access.

## Core knowledge
Identity design must distinguish human and workload identities, authentication from authorization, and control-plane from data-plane privileges. Lifecycle and revocation matter as much as login.

## Procedure
1. Inventory actors and workloads.
2. Map authentication mechanisms and trust relationships.
3. Define authorization boundaries and least privilege.
4. Design service identities and credential lifecycle.
5. Address provisioning and deprovisioning.
6. Define privileged and emergency access.
7. Specify audit requirements.
8. Test positive and negative authorization paths.

## Decision points
Prefer federation and short-lived credentials over duplicated identity stores and static secrets where supported.

## Common failure patterns
Role explosion, shared service accounts, permanent admin rights, authorization enforced only in UI, and incomplete offboarding.

## Verification
Access tests prove intended users can act and unauthorized identities cannot; revocation and audit trails are validated.

## Expected output
An identity architecture with roles, trust, lifecycle, and controls.

## Stop conditions
Stop when identity ownership is unclear or mandatory controls cannot be implemented.