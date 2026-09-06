# API Release and Progressive Delivery

## Purpose
Release API platform and routing changes with bounded blast radius and objective rollback criteria.

## When to use
Use for gateway upgrades, policy changes, new API versions, routing migrations, or high-risk platform releases.

## Inputs
Change set, SLOs, deployment topology, traffic segmentation, test evidence, rollback mechanism.

## Context to inspect
Inspect CI/CD, environment parity, route ownership, feature flags, current health, and dependency compatibility.

## Core knowledge
Progressive delivery separates deployment from full exposure. Safe releases require representative canaries, comparable telemetry, and automated or unambiguous rollback thresholds.

## Procedure
1. Classify change risk and affected traffic.
2. Define pre-release validation and invariants.
3. Establish rollback path before deployment.
4. Choose canary segment that is representative but bounded.
5. Deploy without changing unrelated configuration.
6. Compare errors, latency, saturation, and business signals against control.
7. Expand traffic in explicit stages.
8. Pause long enough to observe relevant failure modes.
9. Roll back immediately on predefined thresholds.
10. Record release evidence and update runbooks.

## Decision points
Use blue/green for rapid environment rollback; canary for traffic-based validation; feature flags for behavior decoupled from deployment.

## Common failure patterns
Canaries receiving trivial traffic, manual subjective promotion, incompatible schema changes, and rollback procedures never tested.

## Verification
Verify each stage against SLO and functional checks and execute rollback drills periodically.

## Expected output
A reproducible release process with bounded exposure and measured promotion.

## Stop conditions
Stop if rollback is unavailable, baseline health is already degraded, or required telemetry is missing.