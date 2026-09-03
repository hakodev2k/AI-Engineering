# Real User Monitoring Rules

## Purpose
Ensure production performance conclusions are grounded in representative user telemetry.

## Scope
Applies to browser RUM instrumentation, sampling, dimensions, privacy controls, dashboards, and production analysis.

## MUST
- Define the population, sampling method, metric semantics, and data freshness for every production performance claim.
- Preserve enough dimensions to identify materially different user cohorts without exposing sensitive data.
- Validate instrumentation changes before comparing new data with historical baselines.
- Document known blind spots such as blocked scripts, unsupported browsers, bots, or missing navigation types.

## MUST NOT
- Treat sampled telemetry as exact population truth without accounting for sampling bias.
- Collect secrets, credentials, or unnecessary personal data for performance analysis.
- silently change metric definitions or aggregation windows.

## SHOULD
- Correlate performance with releases, routes, devices, regions, and error outcomes.
- Retain raw-enough diagnostic context to support incident investigation within privacy constraints.

## Exceptions
Sampling or retention exceptions require documented operational need, privacy review where applicable, and an expiry or reassessment date.

## Verification
Inspect instrumentation configuration, payloads, sampling logic, dashboard queries, privacy controls, and cross-checks against lab measurements.