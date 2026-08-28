# Build Observability Rules

## Purpose
Provide operational visibility into build health, performance, reliability, and capacity.

## Scope
Applies to local build telemetry, CI builds, remote execution, caches, queues, worker pools, and dependency resolution services.

## MUST
- Build telemetry MUST distinguish queue time, execution time, cache time, transfer time, and failure categories where applicable.
- Metrics used for decisions MUST have stable definitions and documented aggregation windows.
- Observability MUST protect source content, credentials, and sensitive developer information.
- Reliability alerts MUST correspond to actionable build-system conditions rather than raw noisy events.
- Significant build regressions MUST be investigated using retained evidence such as traces, profiles, or trend metrics.

## MUST NOT
- MUST NOT collect sensitive source or environment data without necessity and appropriate controls.
- MUST NOT treat aggregate averages alone as sufficient evidence for tail-latency or intermittent failure problems.
- MUST NOT instrument build paths so heavily that telemetry materially distorts measured performance without accounting for overhead.

## SHOULD
- Dashboards SHOULD expose success rate, latency percentiles, cache behavior, queue saturation, and top failure classes.
- Telemetry SHOULD support comparison by revision, platform, and build mode.

## Exceptions
Exceptions require documented privacy or platform constraints and an alternative evidence source.

## Verification
Inspect metric definitions, traces, retention, redaction, alert thresholds, and incident evidence from representative build failures.