# Incident Timeline Reconstruction

## Purpose
Build an evidence-backed chronology that explains detection, propagation, response actions, system changes, recovery, and important decision points.

## When to use
Use during complex incidents and as preparation for post-incident analysis.

## Inputs
Alerts, logs, traces, deployment events, chat records, tickets, audit logs, responder notes, and external dependency events.

## Context to inspect
Inspect timestamp formats, clock skew, event ingestion delays, missing telemetry, responder-local time zones, and automated versus manual actions.

## Core knowledge
A useful timeline distinguishes event occurrence from observation time. It should support causal analysis without rewriting uncertain events as facts.

## Procedure
1. Choose one canonical time zone, preferably UTC for technical evidence.
2. Gather high-value system and human events.
3. Record source and confidence for each event.
4. Distinguish occurrence, detection, notification, action, and recovery times.
5. Correct known clock offsets without altering original evidence.
6. Align deployments and configuration changes with symptom changes.
7. Mark gaps and conflicting timestamps explicitly.
8. Identify key decision points and delays.
9. Validate the chronology with responders and telemetry.
10. Preserve links or identifiers to source evidence.

## Decision points
Use coarse timestamps when precision is unsupported; do not invent ordering for events within uncertain windows. Include human actions only when operationally relevant.

## Common failure patterns
Mixing time zones, relying on memory, omitting failed mitigations, confusing log ingestion time with event time, and polishing the timeline until uncertainty disappears.

## Verification
Cross-check critical transitions against at least one authoritative telemetry source and responder records.

## Expected output
A chronological incident timeline with timestamps, events, sources, confidence, and identified gaps.

## Stop conditions
Escalate evidence handling when timeline construction requires restricted security, legal, or personal data beyond authorized scope.