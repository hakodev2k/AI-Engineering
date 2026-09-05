# Task Continuity Rules

1. An active autonomous goal **MUST** exist outside transcript content that compaction may discard.
2. A checkpoint **MUST** contain goal, status, completion criteria, pending work, evidence references, resume mode, and schema version.
3. A checkpoint **MUST NOT** contain plaintext credentials, secrets, or hidden chain-of-thought.
4. Before compaction, the runtime **MUST** persist the checkpoint atomically or abort compaction.
5. After compaction, the runtime **MUST** validate the checkpoint before declaring success or requesting a new task.
6. Autonomous runs with pending work **MUST NOT** require a new user message merely because compaction occurred.
7. Completion **MUST** be based on observable acceptance criteria and evidence, not the presence of a summary sentence claiming completion.
8. Pending external agent/tool handles **MUST** be preserved or explicitly marked unrecoverable.
9. A lost required handle **MUST** trigger bounded recovery and **MUST NOT** be silently ignored.
10. Re-planning after compaction **SHOULD** occur only when checkpoint evidence invalidates the existing plan; repeated re-planning without progress **MUST** stop within two cycles.
11. The implementing agent **MUST NOT** be the sole verifier of post-compaction success.
12. Unknown continuity state **MUST** resolve to BLOCKED, never SUCCESS.