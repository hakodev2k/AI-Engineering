# Telemetry Quality Rules

## Purpose
Ensure security decisions are based on trustworthy, sufficiently complete telemetry.

## Scope
Security logs, endpoint events, identity records, network telemetry, cloud audit trails, and application security events.

## MUST
- Critical telemetry sources MUST have documented owners, schemas, retention, expected volume, and health checks.
- Time synchronization and source identity MUST be reliable enough to correlate events.
- Material ingestion loss, parsing failure, or schema drift MUST generate visible operational signals.
- Detection coverage MUST account for known telemetry blind spots.

## MUST NOT
- MUST NOT treat absence of logs as proof that activity did not occur.
- MUST NOT discard security-relevant fields without documented justification.

## SHOULD
- Telemetry quality SHOULD be measured for completeness, freshness, parse success, and retention compliance.

## Exceptions
Temporary telemetry gaps require risk assessment, compensating monitoring, owner, and restoration target.

## Verification
Inspect source inventories, health dashboards, ingestion metrics, schema tests, retention settings, and gap records.