# Discover Authorization Rules

## Purpose
Build an evidence-backed inventory of authorization rules before analysis.

## When to use
Use before changing RBAC/ABAC policies, route authorization, middleware, API gateways, IAM documents, or application-level permission code.

## Inputs
Repository root, policy locations, evaluation semantics, optional runtime traces.

## Preconditions
Read access to repository and configuration. Do not require production write access.

## Allowed tools
Repository search, file reads, tests, configuration inspection, non-destructive CLI commands.

## Constraints
Do not infer policy order when the platform documents a different algorithm. Record unknown semantics as an open question.

## Procedure
1. Locate authorization entry points: middleware, filters, attributes, policy registries, gateway rules, IAM files, database-backed permission loaders.
2. Identify evaluation semantics: first-match, deny-overrides, allow-overrides, most-specific, or custom.
3. Extract each rule's id, priority/order, effect, principals, actions, resources, conditions, source path and line evidence.
4. Identify defaults applied when no rule matches.
5. Locate tests that prove authorization behavior.
6. Produce a normalized policy map consumable by `scripts/policy_shadow_gate.py` when first-match semantics apply.
7. Separate facts from hypotheses and unknowns.

## Expected output
A policy inventory plus evidence references and unresolved semantic questions.

## Verification
Every normalized rule maps to a real repository source or generated policy artifact.

## Failure handling
If policy order cannot be established, stop automated shadow classification and hand off as `needs-semantics-review`.

## Stop conditions
Stop if credentials or production mutation would be required to continue.