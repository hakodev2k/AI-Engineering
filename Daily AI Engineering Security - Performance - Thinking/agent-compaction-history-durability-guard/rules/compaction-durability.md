# Compaction Durability Rules

- Compaction MUST be treated as a state transition, not only as prompt shortening.
- Source history MUST remain recoverable until a post-compaction durability check passes.
- A generated summary MUST NOT be the only durable record of the source turns it summarizes.
- Destructive pruning or parent-session deletion MUST NOT occur before source count/hash evidence is committed.
- Precommit evidence MUST include source path/session id, record count, SHA-256 digest, and timestamp supplied by the host.
- Post-compaction verification MUST prove that either the source transcript is unchanged and durable or a verified archive matches the precommit count/hash.
- Missing source, truncated archives, parse errors, or hash/count mismatches MUST block compaction finalization.
- Interrupted compaction MUST leave enough durable metadata to determine whether rollback or resume is safe.
- Retry loops MUST be bounded to at most two verification retries; retries MUST NOT delete evidence.
- Verification MUST be independent from the model-generated summary content.
- Operators SHOULD retain the precommit/commit ledger long enough to support incident review and recovery.
