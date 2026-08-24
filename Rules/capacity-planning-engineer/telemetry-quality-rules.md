# Telemetry Quality Rules
## Purpose
Ensure capacity decisions rely on trustworthy measurements.
## Scope
Metrics, logs, traces, sampling, aggregation, cardinality, and data retention used for planning.
## MUST
- Critical capacity metrics MUST have defined units, aggregation semantics, and source ownership.
- Missing data, sampling, resets, and aggregation bias MUST be evaluated before conclusions are drawn.
- Planning datasets MUST preserve enough history to observe relevant cycles and peaks.
## MUST NOT
- MUST NOT mix incompatible metric definitions across environments or versions without normalization.
- MUST NOT treat monitoring gaps as zero demand.
## SHOULD
- Key metrics SHOULD have automated quality checks where feasible.
## Exceptions
Low-quality telemetry requires uncertainty bounds and remediation tracking.
## Verification
Inspect metric definitions, raw samples, retention, gaps, and cross-source reconciliation.