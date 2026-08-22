# Environment Promotion

## Purpose
Define how release candidates advance across environments without artifact drift or ambiguous readiness.

## When to use
Use when multiple validation environments precede production or when promotion requires approvals and evidence.

## Inputs
Environment inventory, artifact registry, configuration model, test suites, approval policy, data constraints, and release risk classes.

## Preconditions
Environment purposes are understood and a release candidate has an immutable identity.

## Context to inspect
Inspect environment parity, configuration differences, test data, network dependencies, promotion records, deployment permissions, and manual steps.

## Core knowledge
Promotion is an evidence transition, not a rebuild. Environments should validate progressively different risks while keeping the artifact constant. Perfect parity is rarely possible; material differences must be explicit and tested.

## Procedure
1. Define the purpose and exit criteria of each environment.
2. Identify material production differences.
3. Define required evidence before each promotion.
4. Promote immutable artifact references rather than source branches.
5. Apply environment configuration through controlled mechanisms.
6. Prevent bypass of mandatory stages for normal releases.
7. Record approvals and automated evidence.
8. Expire stale candidates when assumptions change.
9. Test emergency promotion as a separate controlled path.
10. Review environment value and remove redundant gates.

## Decision points
Use fewer environments when automated ephemeral validation gives equivalent confidence. Use production-like staging when integration, migration, networking, or scale behavior cannot be validated earlier.

## Common failure patterns
Rebuilding at each stage, treating environments as permanent snowflakes, approvals without criteria, promoting stale candidates after newer incompatible changes, and relying on staging data that hides production edge cases.

## Verification
Trace a production artifact backward through every promotion, confirm exit evidence exists, and verify no artifact content changed between stages.

## Expected output
A documented promotion model with explicit environment purpose, criteria, evidence, and bypass controls.

## Stop conditions
Stop if environments cannot identify deployed artifact versions, material production differences are unknown, or required promotion evidence cannot be collected.