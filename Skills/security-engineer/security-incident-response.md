# Security Incident Response

## Purpose
Provide a repeatable process to contain, investigate, remediate, and learn from security incidents while preserving evidence and service safety.

## When to use
Use for suspected account compromise, credential exposure, malicious access, data exposure, unauthorized configuration changes, malware, or other confirmed or suspected security events.

## Inputs
Incident description, alerts, logs, affected systems, identities, timelines, business impact, available responders, recovery procedures.

## Context to inspect
Authentication events, audit logs, deployments, configuration changes, network activity, privileged access, affected data, backups, and dependency status.

## Core knowledge
Incident response should prioritize safety, evidence preservation, containment, eradication, recovery, and lessons learned. Actions can destroy forensic evidence or worsen outages, so changes must be deliberate and documented.

## Procedure
1. Establish incident severity and response ownership.
2. Record initial evidence, timestamps, affected assets, and assumptions.
3. Preserve relevant logs and volatile evidence where feasible.
4. Contain confirmed malicious access using the least disruptive effective action.
5. Revoke or rotate exposed credentials and tokens.
6. Identify root cause and attacker path using available evidence.
7. Remove persistence and remediate the exploited weakness.
8. Restore services from trusted state and validate integrity.
9. Monitor for recurrence or related indicators.
10. Document timeline, impact, decisions, residual risks, and follow-up controls.

## Decision points
Contain immediately when ongoing compromise presents material harm. Coordinate before destructive actions when evidence preservation, legal, privacy, or business continuity obligations apply.

## Common failure patterns
Changing systems before preserving evidence, focusing only on the first alert, failing to revoke all related credentials, restoring from untrusted state, poor decision logging, and closing without systemic remediation.

## Verification
Affected identities and systems are validated as clean, exposed access is revoked, vulnerable paths are remediated, monitoring shows no recurrence, and follow-up actions have owners.

## Expected output
A documented incident timeline, containment and recovery evidence, root-cause assessment, impact statement, and prioritized corrective actions.

## Stop conditions
Escalate immediately when legal notification, law enforcement, forensic preservation, customer communication, or executive risk decisions are required.