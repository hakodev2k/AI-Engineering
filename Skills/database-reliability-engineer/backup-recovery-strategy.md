# Backup and Recovery Strategy

## Purpose
Design recoverable database backups with evidence that required data can actually be restored.

## When to use
Use for new databases, recovery-policy changes, audits, migrations, or after restore failures.

## Inputs
RPO, RTO, data size, change rate, retention requirements, encryption requirements, and platform capabilities.

## Context to inspect
Backup schedules, storage isolation, encryption, retention, restore tooling, dependencies, and prior restore tests.

## Core knowledge
A successful backup is not proof of recoverability. Recovery design must cover corruption, deletion, credential compromise, regional failure, and operator error.

## Procedure
1. Translate business requirements into RPO/RTO.
2. Inventory databases and dependent state.
3. Choose full, incremental, log, snapshot, or managed backup mechanisms.
4. Isolate and protect backup storage.
5. Define retention and immutability where justified.
6. Automate backup verification.
7. Perform representative restores into isolated environments.
8. Measure recovery time and data loss.
9. Document recovery order and ownership.
10. Schedule recurring restore drills.

## Decision points
Choose backup frequency from RPO and workload cost. Prefer immutable or independently controlled copies for ransomware and privilege-compromise scenarios.

## Common failure patterns
Untested backups, shared credentials, missing encryption keys, restoring only schema, undocumented dependencies, and assuming snapshots equal disaster recovery.

## Verification
Restore a representative backup, validate consistency and application access, measure RPO/RTO, and record evidence.

## Expected output
A tested backup and recovery plan with schedules, retention, restore procedure, owners, and measured recovery results.

## Stop conditions
Escalate if required RPO/RTO cannot be met, keys are unavailable, or testing would risk production data.