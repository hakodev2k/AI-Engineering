# Smart Contract Design

## Purpose
Design contract boundaries, state models, invariants, and callable interfaces that are secure, economical, testable, and maintainable.

## When to use
Use before implementing or refactoring contracts, introducing a new asset flow, or changing protocol state. Do not use for purely off-chain services.

## Inputs
Functional requirements, asset model, invariants, actors, authorization rules, chain constraints, expected transaction patterns.

## Preconditions
Critical business rules and trust assumptions are available.

## Context to inspect
Existing contracts, inheritance, storage layout, modifiers, events, libraries, proxy patterns, external calls, and historical incidents.

## Core knowledge
Contract design must prioritize invariants, least privilege, deterministic state transitions, reentrancy safety, bounded resource use, and upgrade/storage compatibility. Public functions are permanent attack surfaces once deployed.

## Procedure
1. Translate requirements into explicit state invariants.
2. Identify assets and privileged operations.
3. Minimize mutable state and contract responsibilities.
4. Define state transitions and invalid transitions.
5. Define external/public/internal interface boundaries.
6. Specify authorization for every state-changing operation.
7. Identify external calls and checks-effects-interactions concerns.
8. Define events required for auditability and indexing.
9. Evaluate storage layout and upgrade implications.
10. Estimate gas-sensitive paths and unbounded loops.
11. Design revert semantics and validation.
12. Create adversarial tests for invariant violations.

## Decision points
Prefer composition over deep inheritance when ownership is clearer. Use upgradeability only when operational requirements justify added governance and storage risks.

## Common failure patterns
Implicit invariants, oversized contracts, unsafe external calls, weak access control, unbounded iteration, hidden assumptions about token behavior, and storage collisions.

## Verification
Run unit, fuzz, and invariant tests; inspect storage layout; review authorization matrix; and measure representative gas costs.

## Expected output
Contract responsibility map, state model, invariants, interface specification, authorization matrix, event plan, and test obligations.

## Stop conditions
Stop when invariants are ambiguous, asset-loss scenarios remain unresolved, or an upgrade model lacks a trustworthy authority design.