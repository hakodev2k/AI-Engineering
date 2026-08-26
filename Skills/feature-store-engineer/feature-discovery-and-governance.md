# Feature Discovery and Governance

## Purpose
Make trustworthy features discoverable and reusable while preserving ownership, policy and lifecycle controls.

## When to use
Use when designing registry/catalog workflows or reducing duplicate feature creation.

## Inputs
Feature metadata, owners, domains, sensitivity labels, consumers and lifecycle state.

## Context to inspect
Existing catalog, search behavior, naming taxonomy, duplicates, access policies and stale features.

## Core knowledge
Discovery requires semantic metadata, not only names. Governance should make the safe path easy: ownership, certification, sensitivity, lineage and deprecation status must be visible.

## Procedure
1. Define mandatory registration metadata.
2. Establish domain-oriented naming and tags.
3. Require owner and support contact.
4. Capture entities, semantics, freshness, lineage and sensitivity.
5. Add search by meaning, domain and entity.
6. Identify duplicates before new registration.
7. Define experimental, certified, deprecated and retired states.
8. Gate sensitive access by policy.
9. Track usage to inform maintenance and retirement.
10. Periodically review orphaned or stale entries.

## Decision points
Certification should reflect evidence and operational maturity, not popularity. Central standards should coexist with domain ownership where scale requires federation.

## Common failure patterns
Registry as a name list, ownerless features, duplicate semantics, stale certification and governance requiring manual tickets for routine safe access.

## Verification
Test that engineers can find an existing relevant feature, understand its contract/quality and request authorized access without tribal knowledge.

## Expected output
A governed feature catalog with clear lifecycle and reuse signals.

## Stop conditions
Stop certification when ownership, lineage or quality evidence is missing.