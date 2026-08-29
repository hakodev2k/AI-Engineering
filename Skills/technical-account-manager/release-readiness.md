# Release Readiness

## Purpose
Assess customer readiness for a product release, upgrade, or feature adoption by validating compatibility, operational impact, testing, supportability, and rollback planning.

## When to use
Use before major upgrades, deprecations, feature launches, or customer adoption of materially changed behavior.

## Inputs
Release notes, compatibility matrix, architecture, integrations, test results, maintenance policy, rollout plan, and support guidance.

## Context to inspect
Deprecated features, API or schema changes, client versions, integrations, customizations, security changes, observability, maintenance windows, and recovery options.

## Core knowledge
Release readiness is risk-based. Senior TAMs distinguish mandatory compatibility work from optional feature adoption and avoid treating non-production success as sufficient production evidence.

## Procedure
1. Identify release changes relevant to the customer environment.
2. Map affected components and integrations.
3. Validate prerequisites, supported versions, and deprecations.
4. Define representative test scenarios.
5. Review operational, security, and performance impact.
6. Establish rollout stages and rollback criteria.
7. Confirm support coverage and escalation paths for the change window.
8. Review evidence before approving customer readiness.
9. Monitor post-release behavior and close residual actions.

## Decision points
Delay adoption when unsupported dependencies or untested critical paths remain. Use phased rollout when the customer has multiple workloads or high blast radius.

## Common failure patterns
Skipping compatibility review, testing only happy paths, overlooking custom integrations, and assuming release notes apply identically to every environment.

## Verification
Confirm all critical paths pass agreed tests and that rollback, monitoring, and support ownership are operationally ready.

## Expected output
A release-readiness assessment with affected components, tests, risks, owners, rollout, and rollback plan.

## Stop conditions
Stop when mandatory prerequisites fail, critical paths remain untested, or the customer cannot safely recover from failure.