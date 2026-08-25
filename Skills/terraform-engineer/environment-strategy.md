# Environment Strategy

## Purpose
Structure Terraform environments so configuration is reusable while state, credentials, risk, and lifecycle remain isolated.

## When to use
Designing dev/stage/prod layouts, multi-account deployments, or reducing environment divergence.

## Inputs
Environment matrix, accounts/subscriptions, regions, ownership, promotion model, compliance boundaries.

## Context to inspect
Directory layout, workspaces, state backends, variable sources, provider aliases, CI mappings.

## Core knowledge
Environment isolation is primarily an ownership, credential, and state problem. Reuse modules, not state. Avoid copy-pasted configurations that silently diverge.

## Procedure
1. Classify environments by trust and blast radius.
2. Separate credentials and remote state for protected boundaries.
3. Create shared modules for stable patterns.
4. Keep environment composition explicit and small.
5. Validate variables and account/region identity.
6. Promote module versions or commits through environments.
7. Add environment-specific policy and approval gates.
8. Test failure isolation.

## Decision points
Use CLI workspaces for genuinely similar instances under one operational model; prefer separate roots/backends for distinct security or ownership boundaries.

## Common failure patterns
Workspace confusion, shared production credentials, copy/paste drift, giant tfvars files, and environment conditionals scattered through modules.

## Verification
Each environment resolves to the intended account/backend, plans independently, and promotion does not require source duplication.

## Expected output
Clear environment isolation with reusable composition and safe promotion.

## Stop conditions
Stop if account identity is ambiguous, production shares mutable state with lower environments, or required isolation cannot be enforced.