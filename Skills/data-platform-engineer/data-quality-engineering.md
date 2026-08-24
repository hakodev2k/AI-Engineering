# Data Quality Engineering

## Purpose
Engineer measurable data-quality controls that detect, contain, and diagnose defects according to business impact rather than relying on ad hoc validation.

## When to use
Use for production datasets, new pipelines, recurring data incidents, or critical analytical/ML inputs.

## Inputs
Data contracts, business invariants, historical distributions, incident history, freshness requirements, and consumer criticality.

## Context to inspect
Existing tests, null/error rates, lineage, quarantine paths, alerts, source behavior, and downstream dependencies.

## Core knowledge
Quality dimensions include completeness, validity, uniqueness, consistency, timeliness, and accuracy. Not every anomaly is a defect; thresholds must reflect domain variability. Controls should be placed where defects can be isolated cheaply.

## Procedure
1. Rank datasets by business criticality.
2. Translate contracts and domain invariants into testable rules.
3. Establish baseline distributions and freshness behavior.
4. Add deterministic checks for hard invariants.
5. Add statistical/anomaly checks only where variability warrants them.
6. Define warn, quarantine, and fail-closed behavior per rule.
7. Attach lineage and ownership to alerts.
8. Preserve evidence needed for root-cause analysis.
9. Test bad-data injection and recovery workflows.
10. Track recurring defects to upstream remediation rather than accumulating downstream patches.

## Decision points
Fail closed when incorrect data is more harmful than delay; warn when continuity is more important and consumers can tolerate uncertainty. Use statistical detection for distribution shifts, not as a replacement for known invariants.

## Common failure patterns
Hundreds of noisy checks, thresholds without baselines, alerts without owners, validating only after publication, conflating missing with zero, and suppressing recurring upstream defects.

## Verification
Inject known violations, verify containment and alert routing, measure false positives, confirm consumers cannot unknowingly read quarantined outputs, and review quality SLO trends.

## Expected output
Quality rules, severity policy, quarantine/recovery mechanism, dashboards, ownership, and incident evidence.

## Stop conditions
Stop when business semantics are insufficient to define correctness or when blocking publication could cause greater harm without stakeholder approval.