# Model Debugging

## Purpose
Diagnose unexpected ML behavior by isolating data, pipeline, optimization, model, and serving causes.

## When to use
For failed training, implausible metrics, unstable convergence, prediction regressions, or offline/online discrepancies.

## Inputs
Logs, metrics, checkpoints, samples, code/config versions, data statistics, serving traces.

## Context to inspect
Recent changes, split integrity, labels, preprocessing, gradients/losses, seeds, hardware, model version, feature parity.

## Core knowledge
Debug from simple invariants outward. Many apparent model problems are data or pipeline problems. Small controlled datasets reduce ambiguity.

## Procedure
1. Reproduce the failure with pinned inputs/configuration.
2. Compare against last known-good run.
3. Validate labels, split, schema, and preprocessing.
4. Attempt to overfit a tiny clean sample when training is suspect.
5. Inspect loss curves, gradients, activations, and numerical anomalies as relevant.
6. Compare intermediate features/predictions across environments.
7. Change one hypothesis-driving variable at a time.
8. Record root cause and add regression protection.

## Decision points
Investigate data first when failures align with source changes; optimization when loss dynamics are abnormal; serving when offline artifact remains healthy.

## Common failure patterns
Random parameter tweaking, changing multiple variables, debugging only aggregate metrics, and failing to preserve failing artifacts.

## Verification
The identified fix removes the failure on the reproducer and a regression test fails before/fixes after the change.

## Expected output
Evidence-backed root cause, fix, and regression guard.

## Stop conditions
Escalate when reproduction requires inaccessible production data or evidence indicates upstream corruption outside ownership.