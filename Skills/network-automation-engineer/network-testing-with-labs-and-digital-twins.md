# Network Testing with Labs and Digital Twins

## Purpose
Validate automation logic and network behavior before production using reproducible labs, emulators, simulators, or digital-twin techniques.

## When to use
Use for new workflows, routing-policy changes, platform upgrades, regression tests, and incident reproduction.

## Inputs
Production topology subset, configurations, images/models, test cases, expected state, and automation artifacts.

## Context to inspect
Platform fidelity limits, virtual feature gaps, timing differences, licenses, test data, and CI resources.

## Core knowledge
Labs prove logic only to their fidelity. Control-plane simulation may not reproduce ASIC, scale, timing, or hardware failure behavior.

## Procedure
1. Define production risk the lab must reduce.
2. Reproduce relevant topology and policy, not unnecessary scale.
3. Pin images/models and lab definitions.
4. Seed representative intent and current state.
5. Run automation from clean baseline.
6. Assert config and operational outcomes.
7. Inject expected failures and partial states.
8. Re-run for idempotency/regression.
9. Document fidelity gaps.
10. Require canary production validation for unmodeled behavior.

## Decision points
Use lightweight mocks for code logic, virtual labs for protocol behavior, and physical labs for hardware-specific features.

## Common failure patterns
Treating mock success as network proof, drifting lab configs, no negative tests, and assuming virtual forwarding performance matches hardware.

## Verification
Rebuild lab from code, reproduce test outcomes, and compare selected behavior with production/canary evidence.

## Expected output
Reproducible lab definition, automated assertions, failure tests, and fidelity statement.

## Stop conditions
Stop promotion when the critical risk depends on behavior the lab cannot model and no safe canary exists.