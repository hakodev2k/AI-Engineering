# Rules: Bounded Agent Loop

- Every automatic continuation MUST re-read the authoritative task state immediately before scheduling the next model turn.
- `paused`, `blocked`, `cancelled`, and `completed` states MUST block automatic continuation.
- Observable progress MUST be represented by an external state change or new verifiable evidence.
- Commentary, acknowledgements, plans, and intention statements MUST NOT by themselves count as progress.
- Identical tool name plus identical normalized arguments MUST be counted as a repeated call.
- A repeated call SHOULD be allowed only when a documented changed precondition can plausibly produce a different result.
- Consecutive no-progress windows MUST have a finite configured maximum.
- Recovery attempts MUST have a separate finite maximum and MUST change the hypothesis or action.
- A fixed global step limit SHOULD remain as a final safety ceiling even when progress-aware gating is enabled.
- Completion MUST include verification evidence; the implementing agent MUST NOT be the sole verifier for high-impact changes.
- The system MUST preserve stop evidence and reason codes rather than silently resetting counters.
- The system MUST NOT increase loop limits during a failing run solely to avoid a stop decision.
