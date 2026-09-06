# Rules: Durable Admission Contract

- Every asynchronous/background run MUST have a stable non-empty `run_id` before it is externally accepted.
- Every externally retriable run-creation request MUST have a stable idempotency key.
- The admission record MUST be durably committed before an external acceptance acknowledgement is emitted.
- An in-memory task, coroutine, process or queue entry MUST NOT count as durable admission.
- Execution MUST NOT start before the run has a durable admission record.
- Duplicate `run_id` or idempotency keys MUST fail closed or resolve to the already-admitted logical run; they MUST NOT create a second logical run.
- After restart, every accepted non-terminal run MUST be reconciled to one of: execution started/known, terminal, or recovery-enqueued.
- An accepted run MUST NOT remain silently orphaned after reconciliation.
- Recovery attempts MUST be bounded to a maximum of 2 unless an operator explicitly changes the policy.
- Irreversible or dangerous side effects MUST NOT be replayed without an idempotency boundary and required human approval.
- Recovery failure MUST be persisted and surfaced; it MUST NOT be hidden by deleting the admission record.
- Crash/restart verification SHOULD include the pre-first-checkpoint window as well as mid-run checkpoints.