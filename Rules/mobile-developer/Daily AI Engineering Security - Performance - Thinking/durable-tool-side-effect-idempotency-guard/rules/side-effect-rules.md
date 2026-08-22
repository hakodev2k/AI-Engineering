# Rules: Durable Side-Effect Execution

- Every side-effecting tool call MUST have a stable logical operation key before execution.
- The operation key MUST remain unchanged across retry, worker restart, checkpoint resume, and transport retry for the same logical action.
- A durable `in_progress` claim MUST be persisted before invoking a high-impact external side effect.
- A `succeeded` operation MUST NOT be executed again; its stored result/reference SHOULD be reused.
- A timeout, disconnect, cancellation, or missing response MUST NOT be interpreted as proof that an external side effect failed.
- Ambiguous outcomes MUST enter `unknown` state and MUST be reconciled before replay.
- High-impact `unknown` operations MUST NOT be replayed without decisive reconciliation evidence or explicit human approval.
- Provider-native idempotency keys SHOULD be supplied when supported, using the same logical operation key.
- Secrets, bearer tokens, raw credentials, and sensitive payload values MUST NOT be stored in operation keys or audit logs.
- Attempt counters MUST be bounded by `max_execution_attempts`; retry loops MUST stop when the limit is reached.
- The implementation agent MUST NOT be the sole verifier for high-impact replay behavior.
- Verification MUST include a fixture where the remote write commits but the caller observes a timeout.
- Completion MUST distinguish Implemented, Measured, and Verified; a successful unit test alone MUST NOT be called production verification.
