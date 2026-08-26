# Red-Team Release Gates

## Purpose
Define evidence-based security gates that prevent material AI adversarial regressions from reaching production.

## When to use
Use when operationalizing red-team results in model, prompt, agent, retrieval, or application release processes.

## Inputs
Threat model, severity rubric, automated evaluations, manual test results, utility baselines, exception process, and deployment workflow.

## Context to inspect
Understand release cadence, model/provider variability, rollback capability, ownership, CI/CD, canary strategy, and production monitoring.

## Core knowledge
A useful gate targets critical invariants and stable signals. Overly noisy gates get bypassed; overly narrow gates miss novel failure modes. Manual exploratory testing remains necessary for major capability changes.

## Procedure
1. Identify release-critical security invariants.
2. Select stable regression tests for each invariant.
3. Define thresholds using repeated baseline data.
4. Separate blocking failures from advisory metrics.
5. Require manual review for high-risk capability changes.
6. Define exception authority, expiry, and compensating controls.
7. Integrate evidence artifacts with the release record.
8. Test rollback and post-deploy monitoring.
9. Review gate effectiveness after incidents and false blocks.

## Decision points
Block on critical deterministic failures immediately. For stochastic metrics, use confidence-aware thresholds and trend analysis rather than single-sample results.

## Common failure patterns
Hundreds of noisy blocking tests; no exception expiry; gates detached from threat model; provider/model version changes without reevaluation; passing tests but missing telemetry.

## Verification
Simulate known failing and passing releases to confirm the gate blocks correctly, produces actionable evidence, and supports safe rollback/exception workflows.

## Expected output
A documented release-gate policy tied to tests, thresholds, owners, and exceptions.

## Stop conditions
Do not approve release when critical evidence is missing or a blocking finding lacks explicit authorized risk acceptance.