# Cloud Workload Federation

## Purpose
Eliminate stored cloud credentials by exchanging trusted workload identity assertions for short-lived cloud access.

## When to use
Use for CI/CD, Kubernetes, multi-cloud workloads, SaaS automation, or any workload currently holding long-lived cloud access keys.

## Inputs
- Identity provider claims
- Cloud IAM capabilities
- Workload trust boundaries
- Required cloud permissions
- Token lifetime requirements

## Context to inspect
Inspect issuer configuration, audiences, subjects, claims, trust policies, role mappings, token lifetimes, runner or cluster identity, and current static keys.

## Core knowledge
Federation shifts security from secret custody to assertion trust. Senior implementation constrains issuer, audience, subject, claims, token lifetime, role permissions, and replay opportunities.

## Procedure
1. Identify workloads using static cloud credentials.
2. Determine available OIDC or equivalent federation path.
3. Define a dedicated cloud role with minimum permissions.
4. Constrain trust to the exact issuer and expected audience.
5. Bind subjects or claims to intended repository, environment, namespace, or workload.
6. Configure short session duration.
7. Integrate token exchange without persisting resulting credentials.
8. Remove old static keys after validation.
9. Monitor federation failures and unusual role assumption.
10. Test attempts from untrusted identities and contexts.

## Decision points
Use direct workload federation when providers support strong claims. Use a broker only when it adds policy control or cross-provider normalization that justifies another trust dependency.

## Common failure patterns
- Trust policies accepting any subject from an issuer
- Wildcard audiences
- Long cloud sessions that negate short-lived identity benefits
- Keeping static keys as an undocumented fallback
- Role permissions broader than the replaced credential required

## Verification
Verify only expected identities can obtain sessions, permissions are minimal, sessions expire, static keys are revoked, and rejected claims generate usable audit evidence.

## Expected output
A short-lived federated authentication flow with constrained claims, scoped role permissions, and static credential retirement.

## Stop conditions
Stop if assertion provenance cannot be trusted, required claims cannot distinguish workloads, or federation would broaden access compared with the existing credential.