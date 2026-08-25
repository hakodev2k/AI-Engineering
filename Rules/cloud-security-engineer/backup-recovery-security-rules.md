# Backup and Recovery Security

## Purpose
Ensure recovery mechanisms remain available, confidential, and resistant to attacker tampering.

## Scope
Backups, snapshots, replicas, vaults, recovery accounts, and restore workflows.

## MUST
- Critical data and configuration MUST have recovery protection aligned to documented recovery objectives.
- Backup administration and deletion permissions MUST be separated or tightly controlled for high-impact systems.
- Recovery copies MUST receive encryption, access, retention, and location protections appropriate to source data.
- Restore procedures MUST be tested with evidence at a frequency justified by criticality.

## MUST NOT
- MUST NOT treat successful backup jobs as proof that restoration works.
- MUST NOT permit routine workload identities to delete protected recovery copies unnecessarily.
- MUST NOT perform irreversible backup deletion without authorized approval.

## SHOULD
- Prefer immutable or logically isolated recovery copies for critical workloads.

## Exceptions
Document recovery impact, alternative controls, owner, duration, and approval.

## Verification
Inspect backup coverage, permissions, immutability settings, encryption, retention, restore-test results, deletion logs, and recovery-account access.