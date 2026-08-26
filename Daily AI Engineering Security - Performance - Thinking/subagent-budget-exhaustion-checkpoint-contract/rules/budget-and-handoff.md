# Rules: Budget and Handoff

- Every bounded subagent run MUST have an explicit budget or a documented external hard-limit source.
- Before each model/provider dispatch, the runtime MUST compare estimated next-call usage against remaining run budget.
- A checkpoint reserve MUST be protected from optional research, retries, and tool exploration.
- At the configured soft threshold, the subagent MUST persist a durable checkpoint before continuing.
- If the next call would violate the checkpoint reserve, the provider call MUST NOT be dispatched.
- Budget exhaustion MUST NOT be reported as `completed`.
- Partial budget exhaustion MUST carry goal, facts, completed steps, next step, verification status, and resumable workspace identity.
- A parent MUST distinguish `partial_budget_exhausted` from `failed` and `completed`.
- Resume MUST load durable checkpoint state before repeating repository scans, retrieval, or verification.
- Token/cost savings MUST NOT be achieved by dropping correctness-critical context or verification.
- Resume/retry loops MUST be bounded; maximum attempts SHOULD default to two.
- Secrets MUST NOT be written to checkpoint artifacts.
