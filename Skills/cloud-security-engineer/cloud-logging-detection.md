# Cloud Logging and Detection

## Purpose
Build security-relevant cloud telemetry and detections that reveal misuse without overwhelming responders.

## When to use
Use when onboarding cloud accounts, expanding services, tuning detections, or closing incident visibility gaps.

## Inputs
Audit sources, threat scenarios, log schemas, retention requirements, SIEM capabilities, and incident workflows.

## Context to inspect
Inspect control-plane logs, identity events, network flows, storage access, key usage, workload logs, log delivery health, and time synchronization.

## Core knowledge
Detection engineering starts from adversary behavior and required evidence. Logs must be complete, tamper-resistant, timely, normalized, and actionable.

## Procedure
1. Map threats to observable events.
2. Enable authoritative audit sources.
3. Centralize logs in a protected account/project.
4. Define retention and access controls.
5. Create high-signal detection logic.
6. Add context and severity criteria.
7. Define response playbooks and owners.
8. Generate controlled test events.
9. Measure false positives, false negatives, and delivery delay.

## Decision points
Alert on high-confidence events; aggregate or hunt on noisy weak signals. Preserve raw evidence when normalization may lose forensic fields.

## Common failure patterns
Logging enabled but not monitored, mutable logs, missing data-plane events, alerts with no owner, and untested rules.

## Verification
Generate representative events end-to-end and prove ingestion, detection, notification, and investigation context.

## Expected output
Validated telemetry coverage and actionable detections tied to threat scenarios.

## Stop conditions
Escalate when required audit data cannot be collected, retention violates policy, or alert routing has no accountable owner.