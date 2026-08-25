# Firmware Incident Response

## Purpose
Respond to suspected firmware compromise or security defects with evidence preservation, fleet containment, safe remediation, and lessons that improve product defenses.

## When to use
Use for exploited vulnerabilities, leaked signing/device keys, malicious firmware, anomalous boot/update behavior, or credible reports affecting deployed devices.

## Inputs
Incident report, affected versions/hardware, logs, binaries, source, signing/provisioning records, fleet inventory, update capabilities, vulnerability details, and operational constraints.

## Preconditions
Establish incident authority and communication channels. Preserve original evidence before destructive debugging or reflashing.

## Context to inspect
Release provenance, signatures, boot measurements, update history, reset/crash logs, key audit records, manufacturing data, network telemetry, debug state, and relevant backend authentication.

## Core knowledge
Firmware incidents can be difficult to observe and slow to remediate because devices may be offline, physically inaccessible, or unable to accept emergency updates. Key compromise can invalidate the trust chain itself. Containment must account for safety and bricking risk.

## Procedure
1. Establish incident scope, severity, owner, and decision authority.
2. Preserve affected binaries, logs, device state, and backend records with hashes/custody notes.
3. Determine whether the issue is vulnerability, active exploitation, signing compromise, provisioning compromise, or false signal.
4. Identify affected hardware/firmware variants and fleet reachability.
5. Define immediate containment: server denylist, feature disable, credential revocation, staged emergency update, or physical isolation as appropriate.
6. Analyze root cause and attacker persistence paths.
7. Develop a minimal safe fix plus regression/security tests.
8. Validate secure-boot/update compatibility and rollback implications.
9. Stage deployment with health telemetry and stop criteria.
10. Rotate/revoke compromised credentials and trust anchors using predesigned mechanisms.
11. Monitor recurrence and complete post-incident control improvements.

## Decision points
Remote kill/disable actions may reduce security impact but create availability/safety harm; require product authority. Full firmware replacement may be safer than narrow patching when persistence cannot be excluded. Key compromise may require trust migration rather than ordinary update.

## Common failure patterns
Reflashing before evidence capture; assuming a crash proves exploitation; releasing emergency firmware without power-loss/rollback testing; revoking keys before devices trust replacements; ignoring manufacturing compromise; overclaiming fleet remediation without telemetry.

## Verification
Confirm affected-version inventory, reproduce/root-cause the defect, validate containment, test fixed firmware against exploit/regression cases, monitor deployment health, and verify compromised credentials no longer authorize operations.

## Expected output
Incident timeline, evidence set, scope assessment, containment/remediation, fleet verification, key actions, and post-incident improvements.

## Stop conditions
Escalate immediately for suspected production signing-key compromise, safety impact, legal disclosure obligations, destructive forensic actions, or inability to recover devices after trust changes.