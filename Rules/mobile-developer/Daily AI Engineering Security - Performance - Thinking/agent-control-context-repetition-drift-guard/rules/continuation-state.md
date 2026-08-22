# Rule: Continuation State Integrity

- Every long-running task MUST have a stable `top_level_goal_id` tied to the user-requested deliverable and acceptance criteria.
- Every delegated/reviewer/planning activity MUST have a distinct `active_subtask_id` and MUST NOT replace the top-level goal unless the user explicitly changes the goal.
- Unchanged control context SHOULD be referenced by stable ID/hash instead of re-injected verbatim after every tool call.
- The host MUST NOT generate acknowledgement-only continuation turns for unchanged control context.
- Required safety, permission, and policy instructions MUST NOT be removed merely to reduce repetition; deduplication must preserve their authority.
- A continuation MUST record whether it produced an action or evidence relevant to the active task.
- Goal-ID drift without an explicit user-approved goal change MUST block completion and trigger restoration.
- More than the configured acknowledgement-only or duplicate-injection threshold MUST trigger deduplication/recovery.
- Recovery loops MUST be bounded by `max_recovery_attempts`.
- The agent MUST NOT claim completion while the restored top-level acceptance criteria remain unmet.
- Independent verification SHOULD confirm goal continuity after a recovery when the task is consequential or long-running.
