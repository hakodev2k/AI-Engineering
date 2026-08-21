# Goal Completion Rules

- Every nontrivial task MUST have a stable `goal_id` and at least one observable required acceptance criterion.
- Criterion IDs MUST be immutable; agents MUST NOT delete required rows to improve apparent progress.
- A correction MUST invalidate downstream evidence and decisions that depended on the corrected fact/assumption.
- Plans, reports, caches, audit files, tests, and orchestration metadata MUST be typed as supporting artifacts unless they are explicitly the requested deliverable.
- A required row MUST NOT become `verified` without an evidence reference and verifier identity/type.
- High-risk or broad implementation changes MUST NOT be verified solely by the implementing agent.
- Terminal `done`/`complete` status MUST be mechanically blocked while any required row is `open`, `in_progress`, `evidence_ready`, or `blocked`.
- A blocker MUST include detection evidence, attempted remediation count, and next escalation.
- Retry loops MUST be bounded to two retries per unchanged hypothesis/failure mode.
- The agent MUST preserve unresolved rows across compaction, resume, and subagent handoff.
- The agent MUST NOT weaken acceptance criteria merely to terminate.
- The final response SHOULD distinguish Implemented, Measured, and Verified.
- If the requested deliverable is missing or unusable, supporting evidence MUST NOT be treated as completion.