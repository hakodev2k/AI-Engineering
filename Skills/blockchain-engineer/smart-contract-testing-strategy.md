# Smart Contract Testing Strategy

## Purpose
Build a layered test strategy that proves contract behavior, invariants, adversarial resistance, and upgrade compatibility.

## When to use
Use for new contracts, protocol changes, audits, and regression prevention.

## Inputs
Requirements, invariants, threat model, contract interfaces, deployment topology, known incidents.

## Preconditions
Expected behaviors and critical invariants are documented.

## Context to inspect
Unit tests, fixtures, forks, mocks, fuzz targets, invariant harnesses, coverage gaps, deployment scripts.

## Core knowledge
Example-based tests prove selected cases; fuzzing explores parameter space; invariant testing checks properties across sequences; fork tests expose integration assumptions. No single layer is sufficient.

## Procedure
1. Map requirements and invariants to test obligations.
2. Build deterministic unit tests for normal and failure paths.
3. Add boundary and authorization tests.
4. Fuzz arithmetic, state transitions, and user-controlled inputs.
5. Add stateful invariant tests for protocol properties.
6. Use adversarial mocks for reentrancy and non-standard dependencies.
7. Add fork tests for real external integrations.
8. Test upgrade and storage compatibility where applicable.
9. Test paused, emergency, and recovery paths.
10. Track regressions from every production/security defect.

## Decision points
Prefer invariants for protocol-wide properties; use forks only when real deployed behavior matters because they are slower and less isolated.

## Common failure patterns
Only happy-path testing, asserting events without state, over-mocking external behavior, weak fuzz bounds, and ignoring multi-step attack sequences.

## Verification
Tests must fail when a known invariant is intentionally broken and pass deterministically in CI.

## Expected output
Traceable test matrix covering functionality, security, invariants, integrations, and upgrades.

## Stop conditions
Escalate when critical invariants cannot be expressed or test environments cannot reproduce material dependencies.