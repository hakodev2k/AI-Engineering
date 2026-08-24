# Retention and Compaction

## Purpose
Preserve required data while bounding cost, privacy exposure, and recovery risk.

## Scope
Retention time, size limits, compaction, tombstones, and archival.

## MUST
- Retention MUST satisfy recovery, replay, legal, and consumer-lag requirements.
- Compaction keys and deletion semantics MUST match the data model.
- Retention changes MUST assess storage, lag, recovery, and privacy impact.

## MUST NOT
- MUST NOT shorten retention below recovery requirements without approval.
- MUST NOT retain sensitive payloads indefinitely by default.

## SHOULD
- Use lifecycle tiers when long-term evidence is required but hot broker storage is not.

## Exceptions
Require documented requirement, risk, cost evidence, and owner approval.

## Verification
Inspect broker policies, storage trends, lag history, replay tests, and deletion behavior.