# Coordination Budget Rules

- The orchestrator MUST distinguish runtime waiting from model reasoning.
- It MUST NOT invoke the model solely because a wait/status timeout elapsed with unchanged observable state.
- It MUST fingerprint wait/status observations and suppress duplicate no-progress observations.
- It MUST apply bounded backoff after three identical no-progress signatures.
- It MUST trip a circuit breaker after five unchanged coordination-only model turns for the same target state.
- A stale, nonexistent, or terminal target MUST NOT be polled indefinitely.
- Every retry loop MUST have a maximum retry count and deadline.
- The system MUST record coordination-only calls, tokens, and timeout ratios.
- Performance claims MUST include before/after measurements on equivalent workloads.
- The circuit breaker MUST NOT terminate a confirmed-running external process; it stops inference/poll churn and switches to event/deadline waiting.
- Human approval or explicit user input MUST immediately supersede automated wait suppression.
- Failures MUST NOT be hidden by increasing timeouts without evidence.