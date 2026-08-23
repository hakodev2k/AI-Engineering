# Release Quality Gates

## Purpose
Define evidence-based release controls that reduce unacceptable risk without turning quality into arbitrary bureaucracy.

## When to use
Use when designing CI/CD gates, release criteria, or exception processes.

## Inputs
Risk model, test results, change scope, vulnerabilities, performance data, incidents, rollback capability.

## Context to inspect
Inspect deployment frequency, reversibility, criticality, current pipeline, environment fidelity, and false-positive history.

## Core knowledge
A gate should correspond to a meaningful risk and reliable signal. Fast reversible releases may tolerate different evidence than irreversible high-risk migrations.

## Procedure
1. Define risks the release process must control.
2. Select objective signals for each risk.
3. Define thresholds and blocking conditions.
4. Separate mandatory gates from advisory signals.
5. Establish time-bounded exception approval.
6. Ensure failures produce actionable diagnostics.
7. Test rollback and recovery evidence.
8. Measure gate effectiveness and bypass frequency.
9. Remove gates that provide no material risk reduction.

## Decision points
Use stricter pre-release gates for irreversible changes; use progressive delivery and production signals when rollback is fast and safe.

## Common failure patterns
Raw coverage thresholds, permanently waived gates, slow duplicated suites, and no exception ownership.

## Verification
Simulate failing evidence, verify blocking behavior, exception auditability, and post-release signal correlation.

## Expected output
A documented set of risk-linked release gates and exception rules.

## Stop conditions
Escalate when stakeholders cannot define acceptable release risk or rollback is unproven for critical changes.