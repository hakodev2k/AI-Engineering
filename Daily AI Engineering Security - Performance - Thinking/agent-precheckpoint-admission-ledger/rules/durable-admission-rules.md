# Durable Admission Rules

1. A background run MUST NOT be acknowledged as accepted until a durable admission record exists.
2. Every admission MUST have a stable unique `run_id`, `idempotency_key`, and input hash.
3. The admission record MUST be stored independently of volatile process memory.
4. The system MUST distinguish `accepted`, `checkpointed`, `completed`, `failed`, and `lost` lifecycle states.
5. `accepted` MUST mean only that durable ownership of the request exists; it MUST NOT imply resumable workflow state.
6. `checkpointed` MUST be set only after the workflow runtime proves the first resumable checkpoint or equivalent durable state exists.
7. Terminal states `completed`, `failed`, and `lost` MUST NOT transition back to non-terminal states.
8. A stale `accepted` record with no checkpoint after the configured timeout MUST be classified and surfaced; it MUST NOT be silently deleted.
9. Reconciliation MUST be bounded and SHOULD run more frequently than the configured loss timeout.
10. Automatic restart of a `lost` run MUST occur only when the task is proven side-effect-free or all side effects are protected by verified idempotency.
11. A potentially side-effecting `lost` run MUST require human review before replay.
12. The ledger MUST NOT store raw secrets, credentials, authorization headers, or unnecessary prompt bodies.
13. Input hashes MUST be used to detect idempotency-key reuse with different logical inputs.
14. Conflicting `run_id` or `idempotency_key` reuse MUST fail closed.
15. The acknowledgement path MUST treat admission-ledger storage failure as an admission failure.
16. Operators MUST measure admission-to-first-checkpoint latency and lost-run rate.
17. Timeout values MUST be based on measured runtime behavior and MUST NOT be increased solely to hide lost runs.
18. Crash testing SHOULD cover before-admission, after-admission/before-checkpoint, after-checkpoint, and after-side-effect boundaries.
19. The implementation agent MUST NOT be the sole verifier of crash/recovery correctness.
20. Completion MUST require evidence that a pre-checkpoint crash remains observable and cannot silently disappear.
