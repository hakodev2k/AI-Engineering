# Compositional Verification

## Purpose
Verify large systems by proving component properties and interaction contracts that compose into system-level guarantees.

## When to use
Use when monolithic verification suffers from state explosion, teams own separate components, or architecture provides stable interfaces suitable for assume-guarantee reasoning.

## Inputs
Component specifications, interface contracts, assumptions, guarantees, shared invariants, composition topology, and target system properties.

## Preconditions
Component boundaries and observable interactions must be defined clearly enough to isolate responsibilities.

## Context to inspect
API/message contracts, shared resources, callback paths, hidden coupling, timing dependencies, error propagation, deployment topology, and ownership boundaries.

## Core knowledge
Compositional reasoning is sound only when each component's assumptions are satisfied by its environment and its guarantees are strong enough for downstream proofs. Circular assume-guarantee arguments require explicit rules or fixed-point reasoning.

## Procedure
1. Decompose the system by stable behavioral boundaries.
2. Define assumptions and guarantees for each component.
3. Identify shared invariants crossing component boundaries.
4. Verify each component under its declared assumptions.
5. Check that connected components satisfy one another's assumptions.
6. Analyze environment behaviors not owned by any component.
7. Detect circular dependencies among contracts.
8. Strengthen or weaken interfaces only for requirement-driven reasons.
9. Compose component results into system-level claims.
10. Re-run affected proofs when contracts change.

## Decision points
Use assume-guarantee reasoning when interfaces are narrower than internal state. Fall back to integrated verification when cross-component coupling dominates or assumptions cannot be localized.

## Common failure patterns
Assumptions stronger than real environments, guarantees too weak to compose, hidden shared state, circular reasoning, and proving components independently while ignoring integration behavior.

## Verification
Check contract compatibility mechanically where possible, inject assumption violations, and validate composed properties against integrated models or tests.

## Expected output
Component contracts, local verification evidence, compatibility results, composed guarantees, and unresolved coupling risks.

## Stop conditions
Stop when hidden coupling invalidates component boundaries, assumptions cannot be discharged, or composition rules do not justify the claimed system property.