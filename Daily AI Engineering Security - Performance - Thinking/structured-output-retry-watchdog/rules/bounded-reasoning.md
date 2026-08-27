# Rules: Bounded Structured-Output Reasoning
- Every structured-output failure MUST receive a canonical failure signature.
- Retry counters MUST be scoped by worker, stage, schema and failure signature.
- The same normalized failure MUST NOT exceed the configured retry cap.
- A repeated retry MUST include new recovery evidence showing what will change.
- Tool activity without a new validated artifact MUST NOT reset the no-progress deadline.
- Parallel orchestration SHOULD permit verified peers to complete when policy permits partial completion.
- Required fields MUST NOT be fabricated to satisfy schema validation.
- A worker that reaches a stop condition MUST emit a typed failure state with retained evidence.
- The implementing agent MUST NOT be the sole verifier for recovery behavior.
