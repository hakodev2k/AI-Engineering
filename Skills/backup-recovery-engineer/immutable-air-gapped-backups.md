# Immutable and Air-Gapped Backups

## Purpose
Protect recovery copies against ransomware, credential compromise, malicious deletion, and correlated administrative failures.

## When to use
Use for high-value systems, ransomware resilience, regulated retention, or environments where production administrators could otherwise delete backups.

## Inputs
Threat model, retention policy, backup platform, identity model, storage capabilities, compliance rules, and recovery objectives.

## Context to inspect
Inspect deletion permissions, retention-lock semantics, root/admin access, network connectivity, key ownership, replication paths, and break-glass procedures.

## Core knowledge
Immutability prevents modification or deletion for a defined retention period. Air gaps can be physical, logical, or operational. A copy is not meaningfully isolated if compromised production credentials can erase it or its keys.

## Procedure
1. Define adversaries and compromise scenarios.
2. Identify copies requiring immutability or isolation.
3. Select retention-lock/WORM controls appropriate to the platform.
4. Separate backup administration identities from production identities.
5. Restrict network and API paths to backup control planes.
6. Protect encryption keys independently.
7. Configure multi-party or break-glass controls for sensitive changes.
8. Audit deletion and retention-policy changes.
9. Test recovery without relying on compromised production services.
10. Periodically verify immutability settings and expiry behavior.

## Decision points
Use logical isolation when operational recovery speed matters; stronger offline separation may be justified for crown-jewel data. Governance-mode controls are weaker than compliance-mode locks where privileged bypass exists.

## Common failure patterns
Immutable data with deletable keys; same SSO/admin plane for production and backups; untested offline restore; retention lock configured after data creation but not actually applied.

## Verification
Attempt authorized negative tests proving protected copies cannot be deleted early, verify independent credentials, and perform recovery from the isolated copy.

## Expected output
A tested ransomware-resilient backup tier with documented trust boundaries.

## Stop conditions
Escalate before enabling irreversible retention locks without approved retention values, or when isolation prevents required recovery objectives.