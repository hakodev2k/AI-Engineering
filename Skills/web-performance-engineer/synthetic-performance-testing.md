# Synthetic Performance Testing

## Purpose
Design repeatable lab tests that detect web-performance regressions and provide deterministic diagnostic evidence before production.

## When to use
Use in CI, release qualification, benchmark investigations, and controlled reproduction of field regressions.

## Inputs
Critical journeys, target devices/networks, production baselines, test environment, build artifact, performance budgets, browser tooling.

## Context to inspect
Confirm environment parity, cache state, geographic placement, test data, authentication flow, CPU/network throttling, browser version, and variance across repeated runs.

## Core knowledge
Synthetic tests trade realism for control. Their value comes from stable methodology, representative constraints, repeated samples, and trace artifacts. A single Lighthouse score is insufficient evidence for a production conclusion.

## Procedure
1. Select journeys that represent meaningful user work.
2. Define cold-cache and warm-cache scenarios separately.
3. Model realistic device CPU and network conditions.
4. Stabilize test data and backend dependencies.
5. Record browser version and environment metadata.
6. Run multiple samples and calculate distributions.
7. Capture trace, waterfall, coverage, and filmstrip artifacts.
8. Establish baseline ranges before adding gates.
9. Detect absolute budget violations and statistically meaningful regressions.
10. Re-run suspicious failures to distinguish noise from repeatable change.
11. Link failures to diagnostic artifacts.
12. Periodically compare lab results with RUM to recalibrate realism.

## Decision points
Use isolated tests for component-level diagnosis and production-like environments for end-to-end qualification. Prefer deterministic resource-size gates when timing variance is high. Use physical devices when throttling fails to represent hardware-specific behavior.

## Common failure patterns
One-run pass/fail logic; testing only home pages; shared noisy environments; unrealistic cache state; uncontrolled third parties; missing release metadata; optimizing for tool score rather than user journey.

## Verification
Confirm repeatability, coefficient of variation, correlation with field trends, and that intentionally introduced regressions are detected by the suite.

## Expected output
A reproducible synthetic benchmark suite with representative scenarios, baselines, diagnostic artifacts, and release criteria.

## Stop conditions
Do not enforce timing gates until variance is understood. Escalate when environment instability prevents distinguishing application regressions from test noise.