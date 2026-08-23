# RAG Freshness Safety Rules

## MUST
- Treat missing source version, indexed version, timestamp, or required hash as unverified and blocking.
- Compare index state against an authoritative source, not against another cache.
- Preserve before/after evidence for remediation.
- Use scoped reindexing when it can repair the affected documents.
- Require explicit human approval before deleting/recreating a production index, changing production ingestion configuration, or performing a full production reindex that can materially affect availability or cost.
- Keep secrets out of evidence files and logs.
- Stop after bounded retries defined by the workflow.

## MUST NOT
- Do not mark an answer fresh merely because retrieval succeeded.
- Do not silently increase index, database, cloud, or queue permissions.
- Do not bypass stale results by raising freshness thresholds during an incident.
- Do not delete source documents, index data, dead letters, or ingestion evidence without approval.
- Do not report verification success while any required metadata is unknown.
- Do not let the implementation agent be the sole verifier after a production-impacting remediation.

## SHOULD
- Prefer immutable source versions and content hashes.
- Sample documents across partitions/tenants instead of only recently accessed records.
- Correlate ingestion events using stable event/document IDs.
- Add freshness checks to CI or pre-release validation when indexes are produced during deployment.
