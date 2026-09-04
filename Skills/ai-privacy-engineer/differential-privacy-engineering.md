# Differential Privacy Engineering

## Purpose
Design, configure, and validate differential privacy (DP) controls for AI/ML workflows where bounded statistical disclosure risk is required.

## When to use
Use for privacy-sensitive analytics, model training, telemetry aggregation, or releases where formal privacy guarantees are preferable to heuristic de-identification.

## Inputs
- Dataset and contribution model
- Query or training workflow
- Privacy target and threat model
- Utility requirements
- Accounting method

## Context to inspect
Inspect sampling, clipping, aggregation, noise insertion, repeated releases, cohort sizes, training epochs, and downstream reuse of outputs.

## Core knowledge
Differential privacy relies on bounded sensitivity, randomized mechanisms, and cumulative privacy accounting. Epsilon and delta are system-level parameters whose meaning depends on neighboring-dataset assumptions, contribution bounds, sampling, and composition. Weak contribution limits can invalidate practical guarantees.

## Procedure
1. Define the neighboring-dataset model and protected unit.
2. Bound each user's contribution.
3. Choose central, local, or distributed DP based on trust assumptions.
4. Select an appropriate mechanism or DP training method.
5. Set clipping or sensitivity bounds.
6. Choose epsilon/delta targets with accountable stakeholders.
7. Implement privacy accounting across repeated operations.
8. Measure utility across realistic parameter ranges.
9. Prevent bypass paths that emit non-private aggregates.
10. Record the full privacy budget and consumption model.
11. Add automated checks for budget exhaustion and parameter drift.
12. Revalidate after workflow changes.

## Decision points
Use tighter budgets for highly sensitive populations or repeated releases. Prefer central DP when a trusted curator exists and utility matters; prefer local DP when the data collector itself should not see exact values, accepting lower utility.

## Common failure patterns
- Publishing epsilon without defining adjacency
- Forgetting repeated-query composition
- Unbounded per-user contribution
- Mixing private and non-private outputs
- Choosing noise scale without utility testing
- Resetting privacy budgets across pipelines that share the same population

## Verification
Recompute privacy accounting independently, test contribution clipping, verify no unprotected release path exists, and benchmark utility against acceptance criteria.

## Expected output
A DP design with protected unit, mechanism, parameters, accounting, utility results, budget controls, and documented guarantees.

## Stop conditions
Escalate if the privacy target is undefined, accounting cannot be made reliable, utility fails at acceptable privacy levels, or the protected contribution cannot be bounded.