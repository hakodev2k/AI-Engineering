# Continuous AI Risk Monitoring

## Purpose
Detect when production behavior, usage, dependencies, or external conditions invalidate pre-deployment risk assumptions.

## When to use
Use for deployed AI systems, especially high-impact, adaptive, externally hosted, or rapidly changing systems.

## Inputs
Production metrics, quality/safety signals, complaints, incidents, model/provider changes, drift metrics, audit findings, regulatory updates.

## Procedure
1. Convert material risk assumptions into observable indicators.
2. Define thresholds, trends, and alert severity.
3. Instrument quality, safety, misuse, drift, access, and operational signals as relevant.
4. Include user complaints and human-review outcomes.
5. Assign signal owners and response playbooks.
6. Correlate technical and business indicators.
7. Review false positives and blind spots.
8. Trigger reassessment on threshold breach or material change.
9. Report residual-risk trends to accountable governance bodies.
10. Retire metrics that do not inform decisions.

## Decision points
Use leading indicators where harm is hard to reverse; lagging incident counts alone are insufficient.

## Common failure patterns
Dashboard without response ownership, aggregate metrics hiding subgroup harm, static thresholds, monitoring only uptime, alerts without governance linkage.

## Verification
Run alert simulations and prove signals trigger named decisions, evidence capture, and reassessment paths.

## Expected output
Risk monitoring specification, thresholds, owners, playbooks, and governance reporting.

## Stop conditions
Escalate when critical risks are not observable with available telemetry.