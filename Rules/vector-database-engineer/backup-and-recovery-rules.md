# Backup and Recovery

## Purpose
Make vector collections, metadata, configuration, and index state recoverable after corruption, deletion, or infrastructure loss.

## Scope
Applies to snapshots, backups, source-of-truth rebuilds, restore procedures, RPO/RTO, and disaster recovery.

## MUST
- Recovery design MUST identify authoritative data, derived vectors, metadata, index configuration, and secrets/configuration needed to restore service.
- Backup frequency and retention MUST satisfy defined RPO requirements.
- Restore procedures MUST be tested periodically against representative data and documented RTO objectives.
- Backups containing sensitive data MUST receive equivalent access and encryption protections.
- Recovery verification MUST include searchability, record counts, schema/index compatibility, and representative relevance checks.

## MUST NOT
- MUST NOT treat an untested backup as proof of recoverability.
- MUST NOT rely on a single online replica as a backup.
- MUST NOT destroy the last recoverable state during remediation without explicit human approval.

## SHOULD
- Derived indexes SHOULD be rebuildable from authoritative sources when practical.
- Restore drills SHOULD include version compatibility and partial-region loss.
- Backup integrity SHOULD be checked automatically.

## Exceptions
Exceptions require documented RPO/RTO impact, alternative recovery mechanism, evidence, risk ownership, and approval.

## Verification
Inspect backup jobs, retention, encryption, restore drill records, integrity checks, recovery runbooks, and recovered-query validation.