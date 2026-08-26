# Rules: Subagent Completion Contract

- Parent agents MUST NOT treat a framework `completed`/`success` flag as sufficient task evidence.
- Every delegated task MUST define expected deliverables or an explicit no-artifact outcome.
- A completion envelope MUST include terminal reason, final result, delivered artifacts, unresolved actions, and verification status.
- `tool_deferred`, stream failure, persistence failure, cancellation, unknown termination, and empty final result MUST NOT be accepted as success.
- Claimed deliverables MUST be checked against observable artifacts when artifacts are expected.
- High-impact work MUST be independently verified by an agent/process other than the implementer.
- Recovery/retry loops MUST be bounded.
- Partial work SHOULD be checkpointed so a failed final response does not force full re-execution.
- No rule may request hidden chain-of-thought.
