# Extended Events Diagnostics

## Purpose
Capture precise SQL Server diagnostic evidence with bounded overhead using Extended Events.

## When to use
Use for intermittent errors, deadlocks, long queries, recompiles, waits, login problems, or events not explained by aggregate metrics.

## Inputs
Incident symptom, time window, candidate events, filtering dimensions, expected event rate, storage limits.

## Context to inspect
Inspect existing sessions, event fields/actions, predicates, targets, retention, causality needs, and production overhead.

## Core knowledge
Extended Events is event-driven instrumentation; session design determines signal, overhead, and storage. Broad high-frequency capture can itself become operational noise.

## Procedure
1. Translate the symptom into specific events and fields.
2. Add only actions needed for attribution.
3. Apply server-side predicates aggressively.
4. Choose ring buffer for small transient capture or event_file for durable analysis.
5. Bound file size/retention.
6. Start during the relevant window.
7. Reproduce or await the incident.
8. Correlate timestamps, session/query IDs, and plans/logs.
9. Stop/remove temporary sessions.
10. Preserve diagnostic artifacts.

## Decision points
Prefer persistent lightweight sessions for recurring critical signals; temporary narrow sessions for high-volume diagnostics.

## Common failure patterns
Capturing every statement, no predicates, oversized ring buffers, forgetting to stop temporary sessions, and collecting fields that cannot identify the workload.

## Verification
Confirm captured events reproduce the symptom and can be correlated to a concrete session/query/root cause with acceptable overhead.

## Expected output
A bounded XE session definition, captured evidence, and diagnostic conclusion.

## Stop conditions
Stop capture if event volume or storage/CPU overhead becomes unsafe.