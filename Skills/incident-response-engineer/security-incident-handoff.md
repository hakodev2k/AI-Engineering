# Security Incident Handoff

## Purpose
Recognize when an operational incident may involve malicious activity or sensitive data and transfer or coordinate response with authorized security responders without losing evidence.

## When to use
Use for suspicious authentication, privilege changes, unexplained data access, secret exposure, anomalous outbound traffic, tampering, or indicators of compromise.

## Inputs
Operational telemetry, identity events, audit logs, network signals, affected assets, data classifications, and security escalation procedures.

## Context to inspect
Inspect account privileges, credential use, audit retention, endpoint/network evidence, sensitive data paths, and prior suspicious events.

## Core knowledge
Operational responders should contain immediate harm but avoid uncontrolled forensic actions. Chain of custody, evidence preservation, confidentiality, and need-to-know communication may become critical.

## Procedure
1. Record suspicious indicators and timestamps without asserting attacker intent.
2. Preserve relevant logs, identifiers, and volatile evidence where authorized.
3. Limit access to incident details according to security procedures.
4. Identify potentially compromised identities, systems, and data.
5. Contact the authorized security incident function with concise evidence.
6. Coordinate containment so operational recovery does not destroy forensic evidence.
7. Track ownership of security and availability workstreams separately.
8. Avoid credential rotation, reimaging, or deletion until security impact is considered unless immediate harm requires it.
9. Continue operational monitoring under security guidance.

## Decision points
Contain immediately when ongoing harm is clear; otherwise coordinate evidence-preserving containment with security specialists. Restrict communications when disclosure itself increases risk.

## Common failure patterns
Publicly discussing indicators, wiping hosts too early, rotating credentials without dependency analysis, assuming compromise from one anomaly, and failing to preserve audit data.

## Verification
Confirm security ownership, evidence preservation, containment responsibilities, and operational recovery constraints are explicitly recorded.

## Expected output
A controlled security handoff with indicators, scope, evidence locations, operational impact, and ownership boundaries.

## Stop conditions
Do not perform invasive forensic or offensive actions outside authorization. Escalate immediately for suspected regulated-data exposure or privileged compromise.