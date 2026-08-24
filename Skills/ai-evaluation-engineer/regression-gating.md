# Regression Gating

## Purpose
Convert evaluation evidence into release gates that block harmful regressions without freezing healthy iteration.

## When to use
Use in CI/CD, model promotion, prompt deployment, retrieval changes, fine-tune rollout, or agent workflow releases.

## Inputs
- Baseline and candidate evaluation results
- Critical metric thresholds
- Statistical confidence requirements
- Risk classification
- Release process

## Context to inspect
Inspect historical variance, flaky metrics, critical slices, incident-linked failures, deployment rollback capability, and current production baseline.

## Core knowledge
A strong gate distinguishes hard invariants from noisy quality metrics. Release criteria should encode both absolute floors and regression deltas, with stricter treatment for safety and catastrophic failures.

## Procedure
1. Define the production baseline and candidate being compared.
2. Separate deterministic hard failures from statistical quality metrics.
3. Set absolute minimum thresholds for critical dimensions.
4. Set allowed regression deltas for noisy metrics.
5. Require sufficient sample size and confidence for comparative gates.
6. Add slice-specific gates for high-risk cohorts.
7. Define handling for flaky or inconclusive metrics.
8. Produce machine-readable pass, fail, or manual-review outcomes.
9. Record evaluation version, model version, and dataset hash with the gate result.
10. Revisit thresholds after production incidents or metric drift.

## Decision points
Use hard blocking gates for policy violations, invalid outputs, or severe safety issues. Use manual review when results are statistically inconclusive but close to the threshold. Avoid relaxing gates solely to unblock a release.

## Common failure patterns
- One aggregate score controls release
- Gates change after results are known
- Flaky judges create random failures
- Candidate compared against stale baseline
- Critical slices are averaged away

## Verification
Verify that known bad historical versions fail, current approved versions pass, and gate results are reproducible from stored artifacts.

## Expected output
A versioned release-gating policy and machine-readable decision artifact.

## Stop conditions
Stop when thresholds are not tied to risk, baseline evidence is stale, or evaluation instability makes automated gating unsafe.