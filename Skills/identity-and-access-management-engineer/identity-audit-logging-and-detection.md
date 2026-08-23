# Identity Audit Logging and Detection

## Purpose
Design identity telemetry that supports investigations, access governance, anomaly detection, and evidence of control operation.

## When to use
Use when onboarding IAM logs, improving detections, preparing audits, or investigating suspicious access.

## Inputs
Identity systems, applications, event schemas, retention requirements, SIEM capabilities, privacy constraints, detection goals.

## Context to inspect
Authentication logs, admin changes, token events, provisioning, group changes, privileged elevation, recovery events, session revocations, log retention and gaps.

## Core knowledge
Useful IAM telemetry preserves who, what, when, where, target, result, policy decision, and correlation identifiers. Detection quality depends on normalized identity context and reliable timestamps.

## Procedure
1. Define critical identity events and threat use cases.
2. Inventory available event sources and blind spots.
3. Normalize identifiers across IdP, apps, cloud, and directories.
4. Capture success and failure events for privileged changes.
5. Add detections for risky sign-ins, MFA changes, privilege grants, dormant-account use, and anomalous service identities.
6. Correlate session, token, and provisioning events.
7. Protect log integrity and restrict sensitive fields.
8. Define retention by investigative and regulatory needs.
9. Test detections with controlled events.
10. Measure alert fidelity and logging coverage.

## Decision points
Prioritize high-impact identity changes over noisy authentication volume; retain raw detail when normalized records could hide forensic evidence.

## Common failure patterns
Missing admin audit logs, inconsistent identifiers, no timezone normalization, excessive sensitive claim logging, and alerts with no response owner.

## Verification
Generate representative identity events and confirm ingestion, correlation, alerting, retention, and investigation usability.

## Expected output
Telemetry map, event requirements, detections, retention policy, coverage gaps, and test evidence.

## Stop conditions
Escalate when privileged actions cannot be audited or required telemetry conflicts with privacy/legal constraints without approved resolution.