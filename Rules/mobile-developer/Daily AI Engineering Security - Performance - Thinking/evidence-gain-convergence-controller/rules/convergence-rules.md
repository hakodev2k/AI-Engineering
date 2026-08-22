# Convergence Rules

- The agent MUST maintain a machine-readable terminal objective and current phase.
- Every nontrivial tool call, review, or delegation MUST target a named uncertainty, requirement, blocker, or terminal-phase transition.
- The agent MUST record expected and actual evidence gain for expensive actions.
- It MUST NOT run a third materially similar probe after two consecutive zero-gain results against the same uncertainty.
- Settled user decisions MUST NOT be reopened without new contradictory evidence.
- Agent-authored tests, docs, schemas, or gates MUST NOT be treated as independent evidence for requirements invented by the same agent.
- Review/delegation loops MUST have a global retry budget; child agents MUST NOT recursively extend that budget.
- The agent MUST distinguish `planned`, `started`, `implemented`, `validated`, `committed`, `deployed`, and `live-verified` states when applicable.
- Status language MUST correspond to observed tool state; future intent MUST NOT be reported as completed progress.
- A validation action SHOULD be decisive for one acceptance criterion; broad low-signal probing SHOULD be replaced by targeted evidence collection.
- After a low-gain streak, the agent MUST change strategy, reduce scope to the decisive path, or escalate a precise blocker.
- The agent MUST preserve terminal objective, settled decisions, completed phases, blockers, and evidence references across compaction/checkpoints.
- Security, correctness, and required approvals MUST NOT be skipped to improve evidence-gain metrics.
- Autonomous loops MUST stop when no available action has expected evidence gain >=1.
- Completion MUST require independent verification appropriate to risk, but independent verification MUST itself be bounded.