# Identity Threat Detection

## Purpose
Detect account takeover, credential abuse, privilege escalation, malicious federation, and abnormal identity behavior with actionable signals.

## When to use
Use when building identity detections, responding to authentication abuse, integrating IAM telemetry with security operations, or tuning noisy alerts.

## Inputs
Authentication logs, MFA events, privilege changes, device/risk signals, token activity, provisioning events, baseline behavior, and threat scenarios.

## Context to inspect
Inspect impossible/unusual travel, unfamiliar devices, MFA fatigue, credential stuffing, password spray, token anomalies, new federation trust, privileged elevation, account recovery, and dormant-account activity.

## Core knowledge
Identity detection should combine high-confidence control events with contextual anomalies. Single weak signals often create noise. Detection must include response actions and account for legitimate automation and travel.

## Procedure
1. Define attacker behaviors and high-impact identity assets.
2. Map behaviors to available telemetry.
3. Build high-confidence detections first.
4. Add contextual enrichment: privilege, device, location, resource, and prior behavior.
5. Suppress known legitimate automation carefully.
6. Assign severity based on potential blast radius.
7. Define containment actions for each severe detection.
8. Test with safe simulations.
9. Review false positives and missed incidents.
10. Update detections as authentication architecture changes.

## Decision points
Automate containment for high-confidence severe signals when lockout risk is controlled. Use analyst review for ambiguous behavioral anomalies.

## Common failure patterns
Alerting on every failed login, ignoring service identities, no privilege context, impossible-travel alerts without VPN context, detecting compromise without revoking sessions, and tuning by disabling alerts.

## Verification
Replay or safely simulate representative attack behaviors and verify alert fidelity, enrichment, routing, containment, and investigation evidence.

## Expected output
A prioritized identity-detection catalog with telemetry dependencies, response actions, tuning guidance, and test evidence.

## Stop conditions
Escalate when telemetry gaps prevent detection of critical identity abuse or automated containment could create unacceptable operational harm.