# Rules: Context Ledger

- Tool results MUST have stable fingerprints before deduplication.
- Deduplication state MUST survive transcript compaction.
- Raw outputs MUST NOT be re-projected when an equivalent fresh ledger entry satisfies the task.
- Critical evidence MUST NOT be removed merely to reduce tokens.
- Secret-bearing outputs MUST NOT be persisted in plaintext ledger storage.
- Every compact entry MUST preserve source provenance.
- Stale entries MUST NOT override fresher entries.
- Projection MUST obey an explicit budget and relevance threshold.
- Token/cache optimization claims MUST include measured usage and quality data.
