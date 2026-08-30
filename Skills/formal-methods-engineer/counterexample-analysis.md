# Counterexample Analysis

## Purpose
Turn failed proof or model-checking traces into root-cause evidence that distinguishes requirement defects, model defects, implementation defects, and invalid assumptions.

## When to use
Use whenever a formal tool produces a counterexample, failed obligation, witness, or unexpected satisfying model.

## Inputs
Counterexample trace, property, model version, solver/model-checker configuration, implementation context, and requirements.

## Preconditions
The failing result must be reproducible from a known revision and configuration.

## Context to inspect
Earliest divergence, enabled transitions, hidden state, environment actions, fairness, bounds, abstractions, and corresponding implementation paths.

## Core knowledge
The shortest trace is not always the clearest root cause. Counterexamples may be genuine design failures, artifacts of an over-permissive environment, consequences of under-specification, or false positives introduced by abstraction.

## Procedure
1. Reproduce the exact failing run.
2. Identify the violated property and first state where it becomes inevitable.
3. Minimize the trace or configuration when practical.
4. Classify every transition as system, environment, failure, or recovery behavior.
5. Check whether the trace relies on an unintended assumption or unconstrained variable.
6. Compare the trace to allowed requirements and real implementation behavior.
7. Determine the defect class: requirement, model, design, code, or environment.
8. Fix the root cause rather than suppressing the trace.
9. Add a regression property or scenario.
10. Re-run the complete verification suite.

## Decision points
Tighten the environment only when the excluded behavior is genuinely impossible or contractually forbidden. Change the property only when the requirement was wrong or incomplete.

## Common failure patterns
Adding assumptions solely to eliminate failures, focusing on the final state instead of causal transitions, dismissing small-model traces as unrealistic, and failing to regression-test the discovered scenario.

## Verification
Confirm the original counterexample disappears for a justified reason and that a mutation recreating the defect still fails.

## Expected output
A minimized trace, root-cause classification, corrective action, and regression evidence.

## Stop conditions
Stop when the trace cannot be reproduced, tool bounds make causality ambiguous, or fixing it requires unresolved product or safety decisions.