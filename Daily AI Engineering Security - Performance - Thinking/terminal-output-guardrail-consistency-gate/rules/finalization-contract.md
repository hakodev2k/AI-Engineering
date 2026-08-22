# Finalization Contract Rules

- A terminal candidate MUST pass the same persistence policy regardless of streamed, non-streamed, resumed, max-turns, timeout, or error-handler path.
- A candidate rejected by an output-guardrail tripwire MUST NOT be persisted as replayable assistant output.
- A successful terminal candidate SHOULD be persisted exactly once when history persistence is enabled.
- A guardrail exception MUST be classified separately from a tripwire; implementations MUST follow their documented replay policy rather than silently treating both as rejection.
- Every persisted tool call MUST have exactly one matching terminal tool result unless the framework explicitly records cancellation with a terminal status.
- Every persisted tool result MUST reference an existing call.
- Terminal-path changes MUST be verified in both streamed and non-streamed modes when both are supported.
- Tests MUST inspect durable session state, not only the visible response.
- A failing parity or orphan check MUST block release of the affected runner path.
- Retries MUST be bounded to two diagnostic reruns; repeated mismatch MUST escalate instead of weakening guardrails or persistence checks.
- The implementing engineer/agent MUST NOT be the sole verifier for a high-risk finalization change.
