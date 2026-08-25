# Rule: Success Classification Contract

1. A child MUST NOT be classified as `success` merely because its process, turn, task wrapper, or notification ended.
2. A success claim MUST have `terminal_state=completed`.
3. `terminal_reason` values indicating deferred work, turn/token/usage/time limit, cancellation, interruption, failure, timeout, or unknown termination MUST NOT map to success.
4. A success claim MUST include a non-empty final deliverable identifier or digest when the task contract requires a deliverable.
5. A success claim MUST have `unresolved_tool_calls=0`.
6. A success claim MUST have `live_descendants=0` unless the parent contract explicitly defines descendants as detached and irrelevant to completion.
7. `task_id` and `dispatch_generation` MUST match the current parent dispatch; stale terminal events MUST NOT complete newer work.
8. Contradictory lifecycle fields MUST be preserved in evidence and MUST result in `incomplete` or `failed`, not an invented success.
9. Parents SHOULD consume a typed classification produced from terminal evidence rather than raw vendor status text.
10. Retries MUST be bounded and MUST NOT replay state-changing work without idempotency protection or explicit approval.
11. The implementing agent MUST NOT be the only verifier of a high-impact completion classification.