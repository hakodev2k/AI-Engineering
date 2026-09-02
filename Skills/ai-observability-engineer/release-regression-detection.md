# Release Regression Detection

## Purpose
Detect operational and semantic regressions introduced by AI model, prompt, retrieval, tool, or application releases.

## When to use
Use for canary releases, model upgrades, prompt deployments, index migrations, or routing changes.

## Inputs
Release metadata, baseline telemetry, canary cohorts, quality signals, SLOs, cost metrics, and rollback capability.

## Context to inspect
Inspect all coupled changes, cohort assignment, model/config/index versions, traffic mix, evaluator versions, and deployment timeline.

## Core knowledge
AI releases can improve one dimension while harming another. Regression gates should cover availability, latency, quality, cost, safety, and capacity where relevant. Comparisons require equivalent cohorts.

## Procedure
1. Define release-specific success criteria and rollback guardrails before rollout.
2. Emit immutable release and effective configuration versions.
3. Establish a recent comparable baseline.
4. Start with a small representative canary cohort.
5. Compare errors, SLO burn, TTFT, generation latency, token usage, cost, fallback, and validated quality signals.
6. Control for workload mix and experiment overlap.
7. Expand rollout only after minimum sample and observation windows.
8. Roll back automatically only for well-understood hard guardrails; require review for ambiguous semantic signals.
9. Preserve release comparison evidence.

## Decision points
Use automatic rollback for clear operational failures; use human review for noisy quality metrics. Prefer progressive delivery when rollback is feasible.

## Common failure patterns
Comparing different traffic mixes, no config versioning, evaluating only error rate, tiny canaries, changing judge rubric during rollout, and irreversible releases.

## Verification
Run a controlled bad canary or replay known regression and prove detection and rollback/hold behavior work as designed.

## Expected output
Release health dashboard, guardrails, cohort comparison, and rollout decision evidence.

## Stop conditions
Stop rollout when hard guardrails breach, attribution is unreliable, or rollback capability is unproven.