# Resilience Regression Testing

## Purpose
Turn important resilience discoveries into repeatable checks that prevent previously fixed failure modes from returning.

## When to use
Use after incidents, chaos findings, architecture changes, dependency upgrades, or resilience-control tuning.

## Inputs
Previous findings, fixes, experiment definitions, SLOs, deployment pipeline, and representative environments.

## Context to inspect
Review the original failure mechanism, remediation assumptions, test stability, runtime cost, and environment fidelity.

## Core knowledge
A resilience fix is incomplete without evidence that it remains effective. Regression experiments should test the property that failed, not merely reproduce implementation details.

## Procedure
1. Translate the finding into a durable resilience invariant.
2. Identify the smallest fault that challenges it.
3. Define deterministic pass/fail signals.
4. Automate setup, injection, observation, and cleanup where safe.
5. Run repeatedly to establish stability.
6. Place the check at an appropriate release cadence.
7. Revisit tests when architecture changes invalidate assumptions.

## Decision points
Use CI for fast deterministic experiments; use scheduled or pre-release game days for expensive environment-level failures.

## Common failure patterns
Tests coupled to old topology, flaky thresholds, silently skipped experiments, measuring only injected fault success, and never retiring obsolete tests.

## Verification
Confirm the test fails when the protection is intentionally disabled and passes with the validated control enabled.

## Expected output
A stable resilience regression check linked to a known risk or invariant.

## Stop conditions
Remove or redesign tests that no longer represent architecture, cannot run safely, or produce unreliable signals.