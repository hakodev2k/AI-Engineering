# AI Authorization Boundary Testing

## Purpose
Verify that AI components cannot make, infer, or bypass authorization decisions beyond the caller's actual privileges.

## When to use
Use whenever AI can retrieve protected data, call tools, select resources, impersonate roles, or perform tenant-scoped actions.

## Inputs
Identity model, roles/permissions, tool APIs, resource ownership rules, session design, and test principals.

## Context to inspect
Locate where identity is established, propagated, transformed, cached, and checked. Distinguish model instructions from deterministic enforcement.

## Core knowledge
The model is not a trusted policy enforcement point. Authorization must bind authenticated principals to specific resources and actions at the execution boundary. Tenant isolation and confused-deputy risks are central.

## Procedure
1. Build a principal-resource-action matrix.
2. Establish allowed and denied baseline requests.
3. Attempt prompt-based role escalation.
4. Substitute resource identifiers and tenant references.
5. Test indirect injection that asks the agent to use its own privileges.
6. Test stale sessions, cached results, delegated tokens, and background actions.
7. Verify denial behavior does not leak sensitive metadata.
8. Trace enforcement to server-side checks.
9. Add negative authorization cases to regression tests.

## Decision points
Use delegated user credentials when actions should inherit user authority; use service identities only with narrowly scoped permissions and explicit policy.

## Common failure patterns
Authorization encoded only in prompts; broad service accounts; trusting model-selected tenant IDs; caching across principals; checking permission after data retrieval.

## Verification
Every denied matrix case must fail at the protected resource or action boundary, independent of model compliance, while allowed cases remain functional.

## Expected output
A tested authorization matrix with bypass findings, root causes, and control recommendations.

## Stop conditions
Stop if tests would access real unauthorized resources; use synthetic tenants or isolated test principals instead.