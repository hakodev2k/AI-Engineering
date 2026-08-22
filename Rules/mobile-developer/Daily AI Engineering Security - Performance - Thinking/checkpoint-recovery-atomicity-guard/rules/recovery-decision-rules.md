# Recovery Decision Rules

- The runtime MUST assign a stable transition ID to every side-effecting checkpoint transition.
- It MUST correlate each external side effect with that transition using an idempotency key, receipt ID, or equivalent durable identifier when the target system supports one.
- It MUST NOT equate streamed progress with durable checkpoint commit.
- It MUST NOT automatically replay a non-idempotent side effect when commit status is `unknown`.
- It MUST prove `committed` or `not_committed` from an authoritative evidence source before choosing skip or replay.
- It MUST classify checkpoint/write version disagreement as a blocking recovery inconsistency.
- It MUST record Facts, Assumptions, Evidence, Decision, Risks, and Verification status without hidden chain-of-thought.
- Recovery evidence collection MUST be read-only by default.
- Retry loops MUST be bounded to two attempts for transient evidence-access failures.
- Dangerous, irreversible, or compensating actions MUST require explicit human approval.
- The agent that performed the original side effect MUST NOT be the only verifier of recovery correctness.
- The workflow SHOULD prefer idempotent side effects and transactional outbox/inbox patterns when the surrounding architecture supports them.
- Completion MUST be blocked if any required side effect remains ambiguous.