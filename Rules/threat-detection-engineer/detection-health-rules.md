# Detection Health Rules

## Purpose
Ensure production detections remain operational as telemetry, schemas, infrastructure, and attack behavior change.

## Scope
Applies to rule execution, data dependencies, parser health, alert pipelines, schedules, and coverage monitoring.

## MUST
- Critical detections MUST have monitoring for execution success, expected data availability, and alert-delivery health.
- Sudden drops or unexplained spikes in critical detection volume MUST be investigated using telemetry and deployment evidence.
- Schema or parser changes affecting required fields MUST trigger compatibility validation before or immediately after rollout.
- Detection owners MUST periodically review stale rules, broken dependencies, and coverage degradation.

## MUST NOT
- MUST NOT assume a rule is healthy merely because its scheduler reports success.
- MUST NOT leave repeatedly failing critical detections enabled without an incident, remediation plan, or explicit risk acceptance.
- MUST NOT silently ignore missing required fields.

## SHOULD
- Health dashboards SHOULD distinguish zero true activity from telemetry or execution failure.
- Critical dependencies SHOULD have automated freshness and completeness checks.

## Exceptions
Exceptions require documented platform limitation, affected coverage, compensating monitoring, owner, and review date.

## Verification
Inspect execution logs, data freshness metrics, parser error rates, alert-delivery checks, health dashboards, and owner review records.