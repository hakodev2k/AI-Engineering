# Freshness and Synchronization Rules

## Purpose
Keep indexed knowledge aligned with authoritative sources.

## Scope
Change detection, incremental updates, deletion propagation, reindexing, freshness objectives, and stale data.

## MUST
- Time-sensitive corpora MUST define measurable freshness objectives.
- Source updates and deletions MUST propagate to retrieval stores within documented bounds.
- Synchronization MUST be idempotent or have explicit duplicate handling.
- Freshness MUST be measured from authoritative source change time when available.
- Failed synchronization MUST be observable by source and affected index scope.

## MUST NOT
- MUST NOT declare data fresh solely because an ingestion job completed.
- MUST NOT retain deleted restricted content beyond approved retention requirements.
- MUST NOT hide stale-index conditions from production telemetry.

## SHOULD
- Prefer incremental updates where they preserve correctness and reduce cost.
- Track source lag and index lag separately.

## Exceptions
Delayed synchronization requires documented impact, mitigation, owner, and expiry.

## Verification
Inspect change logs, deletion tests, lag dashboards, reconciliation samples, and replay tests.