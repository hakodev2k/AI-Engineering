# Reporting Operations Rules

## Purpose
Keep recurring analytical outputs reliable in production use.

## Scope
Scheduled reports, dashboards, extracts, alerts, and recurring metric deliveries.

## MUST
- Define refresh cadence, data availability expectations, owners, and failure handling.
- Detect stale, partial, or failed refreshes before consumers rely on them.
- Separate source delays from analytical pipeline failures in status reporting.
- Provide rollback or recovery steps for material reporting defects.

## MUST NOT
- MUST NOT silently serve stale data as current.
- MUST NOT publish partially refreshed outputs without a visible status indicator.

## SHOULD
- Monitor freshness, row volume, and critical metric continuity automatically.

## Exceptions
Manual recurring processes require equivalent checklists and ownership until automated.

## Verification
Inspect run history, freshness timestamps, failure alerts, ownership metadata, recovery tests, and incident records.