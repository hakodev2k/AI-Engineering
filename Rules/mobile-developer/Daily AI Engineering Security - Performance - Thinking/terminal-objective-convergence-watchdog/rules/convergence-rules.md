# Convergence Rules

- The agent MUST persist one explicit terminal objective and observable acceptance criteria.
- Every expensive tool action MUST name the criterion, blocker, or uncertainty it is intended to change.
- The agent MUST record whether the action produced decisive, partial, or no evidence gain.
- It MUST NOT repeat an equivalent probe after two no-gain outcomes without changing the hypothesis or method.
- Three bounded low-gain cycles without terminal-state movement MUST trigger checkpoint-and-stop/escalation.
- Settled user decisions MUST NOT be reopened unless new contradictory evidence is recorded.
- Compaction/resume MUST preserve terminal objective, authority, verified phases, blockers, settled decisions, and touched-file provenance.
- Progress language MUST be mechanically consistent with verified phase state; `deployed`, `fixed`, `committed`, or equivalent claims require corresponding evidence.
- Narration, turn count, tool-call count, or token usage MUST NOT count as progress by themselves.
- External durable waits MUST transition the task to `blocked` rather than trigger autonomous no-change continuation.
- Completion MUST distinguish Implemented, Measured, and Verified.
- Irreversible actions MUST still require the configured human approval even when convergence budgets are exceeded.
- The implementing agent MUST NOT be the sole final verifier for high-impact completion claims.