# Terminal Output Policy Rules

- Every externally delivered terminal output MUST have an explicit output-guardrail verdict, regardless of whether it originated from the normal agent path or an error handler.
- A `max_turns` fallback MUST NOT bypass output guardrails merely because it was produced by a run-error handler.
- Missing, failed, or unknown guardrail execution MUST block delivery when the configured policy is fail-secure.
- A rejected candidate output MUST NOT be persisted as an accepted assistant output.
- Completed tool calls that are already committed MUST preserve their matching outputs according to the runtime's documented session semantics.
- The terminal session MUST NOT contain an orphaned tool call without the matching terminal record required by the framework contract.
- Streaming and non-streaming variants SHOULD produce equivalent accepted/rejected session semantics for equivalent executions.
- The implementation agent MUST NOT be the only verifier for terminal-path changes.
- Verification retries MUST be bounded by `max_verification_retries`.
- Tests MUST cover normal output, max-turns fallback, guardrail tripwire, resumed approval, streaming, and non-streaming paths when supported by the runtime.
- Security policy MUST NOT be weakened to preserve a fallback response.
