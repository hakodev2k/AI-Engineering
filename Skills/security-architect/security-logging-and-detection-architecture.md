# Security Logging and Detection Architecture

## Purpose
Design security telemetry so material misuse, control failures, and suspicious behavior can be detected and investigated reliably.

## When to use
Use for new platforms, high-risk applications, central logging programs, cloud migrations, or incident-driven redesign.

## Inputs
Threat model, critical assets, identity flows, application events, infrastructure telemetry, retention requirements, detection tooling, privacy constraints.

## Preconditions
Important security events and investigation stakeholders can be identified.

## Context to inspect
Application logs, identity logs, cloud audit logs, endpoint/network telemetry, SIEM pipelines, schemas, retention, access controls, and alert ownership.

## Core knowledge
Security telemetry should be threat-informed, structured, trustworthy, time-synchronized, privacy-aware, and useful for investigation. Logging everything without prioritization creates cost and noise rather than detection quality.

## Procedure
1. Map high-risk abuse cases to observable events.
2. Define required event fields, identities, timestamps, outcomes, and correlation identifiers.
3. Protect log integrity and restrict access.
4. Centralize high-value telemetry with resilient delivery.
5. Define retention based on investigation and compliance needs.
6. Design detections around meaningful attack sequences and control failures.
7. Assign alert ownership and response expectations.
8. Test loss, delay, duplication, and malformed-event scenarios.
9. Measure detection coverage and false-positive burden.

## Decision points
Prioritize high-confidence events for immediate alerting and lower-confidence signals for correlation or hunting. Retain expensive telemetry only when its investigative value justifies cost.

## Common failure patterns
Unstructured logs, missing actor identity, no denied-action logging, noisy alerts, excessive sensitive data in logs, and no ownership for detections.

## Verification
Replay representative security scenarios and confirm events arrive, correlate correctly, trigger expected detections, and support investigation.

## Expected output
A telemetry and detection architecture with event requirements, pipelines, retention, ownership, and validation scenarios.

## Stop conditions
Stop when critical abuse paths have no observable signals, privacy constraints are unresolved, or telemetry reliability cannot meet investigation needs.