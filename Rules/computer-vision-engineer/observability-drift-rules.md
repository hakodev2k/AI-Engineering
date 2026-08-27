# Observability and Drift Rules

## Purpose
Detect production degradation that offline validation cannot predict indefinitely.

## Scope
Input quality, data drift, output distributions, latency, failures, model versions, and feedback signals.

## MUST
- Production telemetry MUST identify deployed model/runtime versions and operational health without exposing prohibited sensitive data.
- Measurable input-quality and distribution indicators relevant to known failure modes MUST be monitored where feasible.
- Alert thresholds MUST correspond to actionable conditions with an owner and response path.
- Drift conclusions MUST use evidence and distinguish covariate change from demonstrated quality degradation when labels are unavailable.

## MUST NOT
- Raw sensitive imagery MUST NOT be logged by default for debugging.
- Distribution drift MUST NOT automatically be equated with model failure without supporting evidence.

## SHOULD
- Delayed ground-truth feedback SHOULD be joined to predictions when lawful and operationally feasible.

## Exceptions
Reduced telemetry requires documented privacy, cost, or platform constraints and compensating checks.

## Verification
Inspect dashboards, metrics definitions, sampling, privacy controls, alert routing, version tags, and feedback-quality reports.