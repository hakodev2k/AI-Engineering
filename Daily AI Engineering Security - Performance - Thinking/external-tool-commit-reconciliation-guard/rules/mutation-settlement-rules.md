# Mutation Settlement Rules

- Every mutating tool call MUST receive a stable operation id before dispatch.
- The system MUST record intent, normalized argument hash, risk class, and available idempotency/business key before dispatch.
- `dispatched` MUST be distinct from `committed`, `failed`, and `unknown`.
- A missing tool result after dispatch MUST be classified `unknown`, not `failed` or `not executed`.
- The system MUST persist returned remote identifiers and a result fingerprint before proceeding to another fragile model/stream step when the host permits durable state.
- An `unknown` mutation MUST enter readback/reconciliation before any retry.
- Readback MUST be non-mutating and SHOULD use the strongest stable identity available: remote id, provider idempotency key, then business key.
- The agent MUST NOT retry an ambiguous irreversible or high-risk mutation without explicit human approval.
- A retry MUST NOT occur merely because the conversation lacks a visible tool result.
- If the provider offers documented idempotency semantics, the implementation SHOULD use an idempotency key derived from the stable operation identity, while respecting provider retention/scope rules.
- The implementation MUST NOT claim exactly-once semantics unless the remote boundary actually provides them or equivalent evidence proves them.
- Readback retries MUST be bounded to two attempts.
- A successful readback proving the intended state MUST suppress duplicate mutation retry.
- A verified absence MAY permit one controlled retry only when retry safety is documented.
- Ledger records MUST NOT contain raw credentials or unnecessary sensitive payloads; store hashes and minimal identifiers.
- The implementing agent MUST NOT be the only verifier for high-risk mutations.
- Completion MUST be blocked while the outcome remains ambiguous and the task requires proof of the external state.