# Rules — Context Compaction Integrity

1. A compaction job MUST freeze an immutable source snapshot before summarization begins.
2. Every compacted artifact MUST record the source `session_id`, source message-ID range, and snapshot watermark.
3. A compacted artifact MUST NOT cite, incorporate, or inherit message IDs from another session.
4. Critical user constraints, approvals, rejections, active goals, completion state, and retry-relevant failures MUST be preserved explicitly or by a stable reloadable reference.
5. Completed work MUST NOT be converted back into pending work unless later source evidence explicitly reopens it.
6. Failed or rejected actions MUST NOT be represented as successful.
7. Messages committed before the snapshot watermark MUST NOT be dropped; messages arriving after it SHOULD be retained verbatim in the post-compaction tail.
8. A compaction summary MUST be marked as reference-only metadata, not an ordinary active user instruction.
9. Validation MUST compare the candidate against a pre-compaction critical-state ledger before publication.
10. Cross-session provenance, unknown source IDs, or missing blocking constraints MUST block publication immediately.
11. Summarization retries MUST be bounded to two attempts per source snapshot.
12. If validation still fails, the system MUST keep the original context authoritative and SHOULD fall back to deterministic eviction of safely reloadable artifacts.
13. Token reduction MUST be measured separately from fidelity; a smaller context MUST NOT be considered successful when integrity regresses.
14. Production rollout MUST include regression fixtures for contamination, fabricated turns, stale-task resurrection, dropped messages, and valid compaction.
15. Operators SHOULD log integrity decisions without logging secrets or full sensitive conversation content.
