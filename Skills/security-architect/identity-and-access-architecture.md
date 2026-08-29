# Identity and Access Architecture

## Purpose
Design identity, authentication, authorization, and privilege boundaries that enforce least privilege while preserving operability.

## When to use
Use for workforce, customer, service-to-service, administrative, and machine identity design.

## Inputs
Identity sources, user populations, service inventory, role model, federation requirements, regulatory constraints, availability targets.

## Preconditions
System owners understand who or what needs access and for which business actions.

## Context to inspect
Existing identity providers, SSO, MFA, service accounts, role models, privileged access tooling, token lifetimes, emergency access procedures, and audit requirements.

## Core knowledge
Identity architecture must distinguish authentication from authorization, human from workload identity, and standing privilege from temporary elevation. Tokens and credentials are security boundaries.

## Procedure
1. Inventory principals and protected actions.
2. Define authoritative identity sources and federation boundaries.
3. Choose authentication assurance levels proportional to risk.
4. Model authorization at resource and action level.
5. Minimize standing privilege and shared accounts.
6. Define service identity and credential rotation patterns.
7. Design session, token, revocation, and recovery behavior.
8. Add privileged-access controls and emergency access procedures.
9. Specify audit events and access review requirements.
10. Test failure, revocation, and misuse scenarios.

## Decision points
Prefer centrally managed federation over duplicated credentials, RBAC when roles are stable, and attribute- or policy-based controls when context materially affects access.

## Common failure patterns
Overbroad roles, long-lived secrets, authorization hidden only in UI logic, unowned service accounts, and emergency access without auditability.

## Verification
Validate positive and negative authorization cases, token expiry and revocation, privileged-access boundaries, and audit coverage.

## Expected output
An identity architecture defining trust sources, authentication assurance, authorization model, privileged access, and lifecycle controls.

## Stop conditions
Stop when authoritative identity sources are unclear, privileged actions cannot be enumerated, or required controls conflict with business-critical recovery needs.