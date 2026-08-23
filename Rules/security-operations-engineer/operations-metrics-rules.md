# Operations Metrics Rules

## Purpose
Measure security operations without incentivizing unsafe behavior or misleading conclusions.

## Scope
Detection, triage, investigation, response, automation, backlog, and quality metrics.

## MUST
- Metrics MUST define calculation method, data source, scope, and known limitations.
- Response-time metrics MUST be interpreted with severity, complexity, and quality context.
- Quality measures MUST include false-positive handling, reopened incidents, missed detections, or equivalent outcome evidence.
- Material metric changes MUST be investigated for process, telemetry, or definition changes before drawing conclusions.

## MUST NOT
- MUST NOT optimize closure speed at the expense of evidence quality or containment correctness.
- MUST NOT compare teams or periods using materially different metric definitions without disclosure.

## SHOULD
- Metrics SHOULD combine timeliness, detection quality, response quality, resilience, and workload sustainability.

## Exceptions
Temporary proxy metrics require documented limitations and replacement criteria.

## Verification
Inspect metric definitions, dashboards, source queries, change history, quality samples, and management decisions based on them.