# Verification Rules

- Acceptance criteria MUST be frozen before final verification.
- The implementing agent MUST NOT be the sole verifier for medium/high-risk changes.
- Verification evidence MUST be bound to a concrete source-state identity such as commit/tree SHA or complete diff hash.
- A test result MUST include command, exit status, timestamp, and source-state identity.
- Lifecycle state MUST NOT transition to DONE when any mandatory criterion lacks current evidence.
- Tool/write success MUST NOT be treated as proof of file integrity.
- The verifier MUST inspect diff scope and detect unexpected deletion/truncation signals.
- The verifier MUST independently reconstruct patch intent from resulting changes and compare it with the original task.
- Unsupported conclusions MUST be labeled unsupported rather than promoted to facts.
- Stale evidence MUST be rerun or rejected.
- Verification loops MUST be bounded to two implementation-reverification cycles.
- Human approval MUST be required before destructive/irreversible remediation.
- The gate MUST NOT weaken security, tests, or acceptance criteria merely to reach completion.