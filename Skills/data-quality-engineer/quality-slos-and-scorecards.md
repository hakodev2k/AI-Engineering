# Quality SLOs and Scorecards

## Purpose
Define consumer-centered quality objectives and scorecards that make reliability measurable without reducing quality to a misleading single number.

## When to use
Use for production data products, domain reviews, service commitments, and quality prioritization.

## Inputs
Consumer requirements, critical data elements, historical performance, business impact, quality metrics, ownership, and incident data.

## Preconditions
Metrics must be reproducible and tied to clear semantics.

## Context to inspect
Review consumption patterns, deadlines, known tolerances, freshness, completeness, accuracy proxies, incident severity, and upstream capabilities.

## Core knowledge
An SLO expresses an acceptable reliability target over a defined window. Scorecards should expose dimensions and critical breaches rather than allowing averages to hide severe defects.

## Procedure
1. Identify critical consumers and decisions.
2. Select measurable quality indicators tied to impact.
3. Define numerator, denominator, scope, and window precisely.
4. Baseline historical performance.
5. Set achievable but meaningful objectives.
6. Define breach severity and error budget where useful.
7. Build scorecards showing dimensions, trends, and ownership.
8. Prevent aggregation from masking critical failures.
9. Review breaches with remediation actions.
10. Revisit objectives when business requirements change, not merely when teams miss targets.

## Decision points
Use binary SLOs for hard requirements and distributional metrics for latency/coverage. Weighting may aid prioritization but should not erase individual critical failures.

## Common failure patterns
Arbitrary 99.9% targets; denominator changes; averaging unrelated datasets; scorecards based on number of tests; targets adjusted to make dashboards green; no consumer validation.

## Verification
Recompute indicators independently, validate definitions with consumers, and confirm known incidents appear as expected breaches.

## Expected output
Documented SLOs and scorecards with definitions, baselines, targets, trends, owners, and breach workflow.

## Stop conditions
Stop publishing comparative scores when definitions differ materially across domains or metrics cannot be reproduced reliably.