# Retention and Replay Rules

## Purpose
Keep retained messages available for required recovery, audit, and reprocessing without uncontrolled cost or unsafe replay.

## Scope
Retention periods, compaction, archival, deletion, replay, and historical reprocessing.

## MUST
- Retention MUST be set from recovery, audit, privacy, and business requirements rather than arbitrary defaults.
- Replay procedures MUST define source range, target consumers, rate controls, idempotency, and stop conditions.
- Retention changes MUST assess recovery windows and consumer downtime tolerance.
- Sensitive retained data MUST follow applicable deletion and access requirements.

## MUST NOT
- MUST NOT shorten retention below required recovery windows without explicit approval.
- MUST NOT bulk replay production traffic without capacity and side-effect analysis.
- MUST NOT assume old messages remain compatible with current consumers without evidence.

## SHOULD
- Archive long-term history separately when broker retention is inefficient.

## Exceptions
Emergency replay requires incident authority, bounded scope, monitoring, and post-action review.

## Verification
Inspect retention policy, storage growth, replay runbooks, compatibility tests, and audit records.