# Localization Release Gating

## Purpose
Define evidence-based release gates so a locale ships only when linguistic, functional, safety, data, and operational requirements are satisfied.

## When to use
Use for new locale launches, major model migrations, prompt rewrites, translation-engine changes, or substantial content refreshes.

## Inputs
Launch scope, evaluation results, QA results, safety findings, known defects, observability readiness, rollback plan, and business priorities.

## Preconditions
Acceptance criteria and severity definitions are agreed before the release decision.

## Context to inspect
Inspect locale scorecards, unresolved defects, model and prompt versions, translation assets, retrieval indexes, monitoring dashboards, feature flags, and support readiness.

## Core knowledge
Release readiness is multidimensional. High aggregate quality does not compensate for critical safety, policy, or workflow failures. Senior engineers use explicit risk acceptance rather than informal confidence.

## Procedure
1. Confirm the release artifact and all dependency versions.
2. Review functional and visual QA by locale.
3. Review multilingual model, retrieval, and translation evaluations.
4. Verify critical safety categories and compliance requirements.
5. Confirm telemetry, alerting, support, and incident ownership.
6. Review unresolved defects by severity and user impact.
7. Validate rollback or locale-disable mechanisms.
8. Obtain explicit acceptance for residual risk.
9. Record the release decision and evidence.

## Decision points
Block on critical safety, data-integrity, policy, or core-task failures. Allow documented minor issues only when impact, workaround, ownership, and remediation date are clear.

## Common failure patterns
Launching on schedule despite missing evidence, averaging locales together, treating translation completion as readiness, and lacking a rollback path.

## Verification
Re-run release-critical checks on the exact candidate configuration and confirm monitoring plus rollback controls work before enabling traffic.

## Expected output
A signed-off locale release record with gates, evidence, residual risks, owners, and rollback criteria.

## Stop conditions
Stop when critical evidence is missing, rollback is impossible for a high-risk change, or unresolved issues exceed agreed acceptance thresholds.