# Secret Access Policies

## Purpose
Design least-privilege policies that control which humans and workloads can read, create, rotate, revoke, or administer secrets.

## When to use
Use when onboarding workloads, reviewing authorization, separating duties, or reducing excessive access.

## Inputs
- Identity inventory
- Secret inventory
- Required operations
- Environment and tenancy boundaries
- Compliance constraints

## Context to inspect
Inspect current roles, groups, service identities, wildcard permissions, inherited policies, administrative paths, break-glass access, and audit records.

## Core knowledge
Read, write, rotate, revoke, and policy administration are distinct privileges. Senior designs separate runtime access from secret administration, constrain paths and namespaces, and avoid broad wildcard policies.

## Procedure
1. Identify each actor and required secret operation.
2. Map secrets into namespaces aligned to ownership and trust boundaries.
3. Define narrow policies by action and path.
4. Separate workload runtime permissions from operator administration.
5. Restrict cross-environment and cross-tenant access explicitly.
6. Add conditions such as workload identity, network context, or claims when appropriate.
7. Define time-bound elevation for exceptional access.
8. Test positive and negative authorization cases.
9. Review transitive group membership and inherited permissions.
10. Record policy ownership and review cadence.

## Decision points
Prefer identity-specific policies when attribution and isolation matter; use groups when lifecycle management outweighs per-identity granularity. Use deny rules sparingly where policy evaluation supports them predictably.

## Common failure patterns
- Wildcard read access
- Combining policy administration with secret consumption
- Shared identities across environments
- Hidden privilege through nested groups
- Policies that cannot be tested automatically

## Verification
Use authorization tests to prove required operations succeed and unauthorized reads, writes, cross-environment access, and policy changes fail.

## Expected output
A least-privilege policy set with ownership, rationale, test evidence, and review requirements.

## Stop conditions
Stop if identity ownership is unclear, policy semantics are ambiguous, or reducing access would break undocumented critical consumers.