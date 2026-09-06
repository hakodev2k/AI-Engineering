# AI Security Metrics and KPIs

## Purpose
Define operational security metrics for AI systems that measure detection coverage, response performance, control effectiveness, abuse trends, and residual risk without incentivizing misleading behavior.

## When to use
Use when building a security operations scorecard, reporting program health, prioritizing engineering work, or evaluating whether AI security controls are improving.

## Inputs
Incident records, alert data, detection inventory, telemetry coverage, response timestamps, abuse volumes, control test results, system inventory, and business risk tiers.

## Preconditions
Metric definitions, data owners, and measurement windows can be made consistent.

## Context to inspect
Review alert severity, incident taxonomy, asset criticality, false-positive dispositions, detection tests, mean-time fields, telemetry gaps, model/tool changes, and known blind spots.

## Core knowledge
Security metrics are useful only when tied to decisions. Counts alone are dangerous: fewer incidents may mean improved security or lost visibility. Prefer paired measures such as detection coverage plus validation rate, alert volume plus precision, and response speed plus containment effectiveness.

## Procedure
1. Identify decisions each metric should support.
2. Define critical assets and threat classes.
3. Measure telemetry coverage for those threats.
4. Track validated detection coverage, not rule count.
5. Measure alert precision and investigation workload.
6. Track time to detect, triage, contain, recover, and verify.
7. Separate attempted abuse from successful impact.
8. Measure recurrence after remediation.
9. Segment metrics by system risk tier, tenant class, model, or agent capability where useful.
10. Document definitions, exclusions, and data quality limitations.
11. Review for incentives that could hide risk.
12. Retire metrics that no longer influence decisions.

## Decision points
Use medians and percentiles rather than averages when response times are skewed. Avoid cross-team league tables unless systems and severity distributions are comparable.

## Common failure patterns
Counting alerts as security value, rewarding low incident counts, measuring MTTD without coverage, hiding false negatives, and changing metric definitions without versioning.

## Verification
Implemented means metrics calculate consistently. Verified means sampled underlying incidents reproduce reported values and stakeholders can state what action each metric informs.

## Expected output
Metric catalog, definitions, calculation rules, dashboards or reports, data-quality notes, targets, and review cadence.

## Stop conditions
Escalate when source data is unreliable, metrics expose sensitive customer information, or leadership requests a metric that creates materially unsafe incentives.