# Rules — Compaction Integrity

- Compaction MUST be treated as a transactional state transition, not merely a summarization request.
- Every admitted message/event MUST have stable identity and MUST survive as snapshot content, structured state, or post-snapshot tail.
- The active goal, completed goals, mandatory constraints, approvals, and blockers MUST be stored outside free-form summary text.
- Compaction summaries MUST be marked reference-only and MUST NOT become the active user turn.
- Compaction MUST measure tokens before and after and MUST NOT report success without meeting the configured reclamation threshold.
- Concurrent inbound messages MUST NOT be dropped during snapshot/rotation.
- Persistence MUST be verified by readback before the old context is discarded.
- Retry loops MUST be bounded to at most two attempts and the next attempt MUST change payload or strategy.
- Retry debris, failed summaries, and diagnostics SHOULD NOT be fed back into the next summarization payload unless required for correctness.
- A failed invariant MUST roll back or retain the original context; the system MUST NOT silently continue with incomplete state.
- Completed work MUST NOT be reintroduced as pending work by summary prose.
- Token savings MUST NOT remove context required for correctness, authorization, safety, or active task completion.
