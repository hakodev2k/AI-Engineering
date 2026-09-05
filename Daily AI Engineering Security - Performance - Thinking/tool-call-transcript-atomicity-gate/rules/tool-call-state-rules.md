# Tool-Call State Rules

1. Every persisted tool `call` **MUST** have exactly one terminal `result` or `cancel` event before the transcript is submitted as complete/resumable.
2. A `result` or `cancel` **MUST NOT** exist without a preceding open `call` using the same `call_id`.
3. `call_id` values **MUST** be unique within a transcript lifecycle.
4. Runtimes **MUST** validate tool-call integrity before checkpoint, compaction output, shutdown persistence, provider submission, and resume.
5. Recovery code **MUST NOT** fabricate a successful result when only execution intent is known.
6. An interrupted call with no durable result evidence **SHOULD** be closed as an explicit cancellation in a repaired copy.
7. Original transcripts **MUST** remain preserved when repair is performed.
8. A side-effecting call with unknown execution status **MUST NOT** be automatically re-executed unless idempotency or safe replay is proven.
9. Dangerous or irreversible re-execution **MUST** require explicit human approval.
10. Recovery loops **MUST** be bounded to at most 2 cycles by default.
11. Repeated resume of a structurally invalid transcript **MUST NOT** be used as a recovery strategy.
12. Structural repair and task-success verification **MUST** be separate; a valid transcript **MUST NOT** imply the task succeeded.
13. The implementation owner **MUST NOT** be the only verifier of a recovery involving uncertain side effects.
14. Logs/tests **MUST NOT** contain secrets or sensitive tool payloads unless appropriately redacted.