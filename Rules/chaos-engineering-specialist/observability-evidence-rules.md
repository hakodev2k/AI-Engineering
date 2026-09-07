# Observability and Evidence Rules

## Purpose
Ensure chaos experiments produce sufficient evidence to explain system behavior, impact, and recovery.

## Scope
Applies to logs, metrics, traces, events, synthetic checks, business indicators, and experiment annotations.

## MUST
- Experiments MUST identify required telemetry before execution and confirm it is available.
- Fault start, changes, stop, and cleanup MUST be timestamped and correlatable with service telemetry.
- Conclusions MUST cite observable evidence rather than operator intuition or agent confidence.
- Telemetry gaps that prevent validation MUST cause the result to be classified as inconclusive.

## MUST NOT
- Missing data MUST NOT be interpreted as absence of impact.
- Sensitive values, credentials, or authentication tokens MUST NOT be added to experiment telemetry.
- Dashboards MUST NOT be selectively scoped after the fact to hide contradictory evidence.

## SHOULD
- Distributed tracing and correlation identifiers SHOULD be used for cross-service failure analysis.
- Experiment events SHOULD be annotated on operational dashboards when feasible.

## Exceptions
If a required signal cannot be collected, the experiment plan requires an alternative evidence source, documented limitations, and reviewer acceptance.

## Verification
Inspect telemetry queries, trace samples, event timestamps, dashboard annotations, data-retention availability, and evidence cited by the experiment report.