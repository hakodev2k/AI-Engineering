# Retention and Deletion Rules

## Purpose
Ensure personal data is retained only as long as justified and is deleted reliably across primary and derived systems.

## Scope
Applies to databases, object stores, caches, backups, analytics stores, indexes, exports, queues, logs, and derived datasets.

## MUST
- Every personal-data category MUST have a defined retention rule, trigger, and deletion or anonymization outcome.
- Deletion workflows MUST cover derived copies, secondary indexes, and downstream systems within defined service levels.
- Retention timers MUST be based on authoritative lifecycle events where possible.
- Failed deletions MUST be observable, retryable, and escalated when deadlines are at risk.
- Backup handling MUST define how deleted data ages out or is protected from ordinary restoration.

## MUST NOT
- Personal data MUST NOT be retained indefinitely by default.
- Deletion MUST NOT mean only removing a UI reference while retaining accessible underlying data.
- Legal holds or investigation holds MUST NOT be applied without documented scope and authority.

## SHOULD
- Deletion SHOULD be idempotent and safe to replay.
- Systems SHOULD minimize the number of independent retention implementations.

## Exceptions
Exceptions require documented basis, scope, duration, controls, and owner approval.

## Verification
Inspect retention configuration, deletion jobs, downstream propagation, backup policy, tombstones, failure queues, and test evidence. Run end-to-end deletion tests using representative records.