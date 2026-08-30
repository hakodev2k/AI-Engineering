# Build Observability and Diagnostics Rules

## Purpose
Make build behavior measurable and failures explainable without requiring privileged knowledge of the build implementation.

## Scope
Applies to build events, logs, traces, timing data, cache telemetry, remote execution telemetry, and failure diagnostics.

## MUST
- Build telemetry MUST identify target, phase, configuration, platform, and outcome at a useful level of granularity.
- Failures MUST preserve the first actionable error and relevant dependency or execution context.
- Performance telemetry MUST distinguish queueing, analysis, execution, data transfer, and test time where applicable.
- Telemetry schemas used by operational dashboards MUST be versioned or changed compatibly.
- Sensitive values MUST be excluded or redacted from logs and traces.

## MUST NOT
- MUST NOT emit unbounded high-cardinality data without an explicit operational need.
- MUST NOT suppress underlying tool diagnostics in favor of generic wrapper errors.
- MUST NOT claim a root cause from telemetry that only establishes correlation.

## SHOULD
- Build traces SHOULD support critical-path analysis and comparison between revisions.
- Repeated failure signatures SHOULD be grouped to reduce diagnostic noise.

## Exceptions
Reduced telemetry for privacy, cost, or performance reasons MUST document which investigations become unavailable and how critical failures will still be diagnosed.

## Verification
Review telemetry schemas, sample failed builds, trace completeness, redaction tests, dashboards, and correlation between emitted events and actual build phases.