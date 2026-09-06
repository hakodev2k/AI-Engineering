# Release Incident Triage

## Purpose
Rapidly determine whether a production AI incident is release-related, contain impact, and preserve evidence for diagnosis.

## When to use
Use when quality, safety, reliability, latency, cost, or downstream behavior degrades during or soon after a release.

## Inputs
Incident report, release timeline, version telemetry, alerts, logs, traces, metrics, recent changes, and rollback controls.

## Preconditions
Incident authority and communication channels are known.

## Context to inspect
Inspect model/config versions, traffic allocation, dependencies, provider status, upstream data, tool calls, retrieval, infrastructure, and concurrent releases.

## Core knowledge
Temporal correlation is not proof, but recent changes are high-value hypotheses. Containment precedes perfect diagnosis when user impact is severe.

## Procedure
1. Establish severity, scope, and affected workflows.
2. Identify exact versions and traffic segments involved.
3. Compare candidate and baseline signals.
4. Check concurrent infrastructure, provider, data, and dependency changes.
5. Preserve representative evidence without violating privacy.
6. Trigger kill switch or rollback when impact crosses predefined thresholds.
7. Verify containment through user-facing and system metrics.
8. Form and test ranked hypotheses.
9. Hand off deeper root-cause work with timeline and evidence.
10. Add confirmed failure cases to regression coverage.

## Decision points
Rollback before root cause when severity is high and rollback is safe. Continue canary observation only when impact is bounded and evidence collection has clear value.

## Common failure patterns
Debating causality while impact grows, relying on averages, losing version attribution, changing multiple mitigations simultaneously, and failing to preserve evidence.

## Verification
Confirm affected traffic has moved to safe behavior, critical metrics recover, and incident evidence identifies versions and timeline.

## Expected output
A contained incident with triage timeline, release-causality assessment, evidence, and next actions.

## Stop conditions
Escalate immediately for severe safety/security impact, unavailable rollback, uncertain containment, or access beyond authorized production scope.
