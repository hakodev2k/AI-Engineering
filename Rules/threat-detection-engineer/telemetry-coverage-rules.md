# Telemetry Coverage Rules

## Purpose
Ensure detections depend on trustworthy, sufficient, and monitored telemetry.

## Scope
Applies to endpoint, identity, network, cloud, application, SaaS, and infrastructure telemetry used for detection.

## MUST
- Required telemetry MUST be documented for every detection domain and mapped to the detections that consume it.
- Critical telemetry sources MUST have health monitoring for availability, freshness, parsing success, and expected volume.
- Missing or degraded telemetry that weakens critical coverage MUST generate an operational alert or tracked incident.
- Collection scope and retention MUST support investigation needs while respecting privacy and legal requirements.

## MUST NOT
- MUST NOT assume ingestion success means fields are complete or semantically correct.
- MUST NOT silently drop security-relevant events because of parsing or schema failures.
- MUST NOT claim detection coverage where required telemetry is unavailable.

## SHOULD
- Telemetry SHOULD favor stable, high-signal fields over brittle presentation-layer text.
- Coverage reviews SHOULD identify blind spots caused by unsupported platforms or configuration drift.

## Exceptions
Exceptions require affected detections, risk, compensating evidence source, owner, and review date.

## Verification
Inspect source inventories, ingestion metrics, schema validation, drop/error rates, retention settings, and coverage tests.