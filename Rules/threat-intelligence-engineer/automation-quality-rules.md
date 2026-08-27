# Intelligence Automation Quality
## Purpose
Ensure automation scales intelligence work without silently amplifying bad data.
## Scope
Ingestion, enrichment, scoring, deduplication, tagging, and distribution pipelines.
## MUST
- Validate schemas, provenance, timestamps, and handling labels at ingestion boundaries.
- Make automated scoring logic reviewable and test it against representative data.
- Provide quarantine or failure paths for malformed and conflicting records.
## MUST NOT
- Auto-promote low-confidence enrichment into confirmed intelligence.
- Allow automation failures to silently discard high-priority intelligence.
## SHOULD
- Measure duplicate rate, enrichment error rate, latency, and stale-data rate.
## Exceptions
Manual emergency processing may bypass unavailable automation while preserving validation.
## Verification
Inspect pipeline tests, dead-letter handling, audit logs, metrics, and sampled outputs.