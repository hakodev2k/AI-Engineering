# Memory Admission Rules

- Every background memory request MUST have a pre-dispatch input-capacity decision.
- The capacity calculation MUST reserve tokens for system instructions, tool/schema overhead when applicable, and expected output.
- Provider/model token counts SHOULD be used when available; estimates MUST be labelled estimates and configured conservatively.
- A deterministic context overflow MUST NOT consume the normal transient retry budget unchanged.
- Oversized input MUST be rechunked, summarized hierarchically, sampled with explicit coverage loss, or blocked; it MUST NOT be silently dropped.
- Source transcript data MUST remain recoverable until memory coverage is verified.
- Every chunk MUST be below the effective input capacity before dispatch.
- Chunk overlap MUST be bounded and measured.
- The pipeline MUST distinguish `implemented`, `measured`, and `verified` memory coverage.
- Retry loops MUST be bounded to two strategy retries for the same source.
- Foreground task success MUST NOT be reported as proof that background durable memory succeeded.
