# Rules: Conflict-Aware GUI Action

1. The runtime MUST represent task constraints and observed GUI facts separately.
2. The runtime MUST NOT treat a model statement such as "this seems fine" as proof of feasibility.
3. Every unresolved conflict between a required constraint and observed state MUST have an explicit identifier and status.
4. A blocking conflict MUST prevent the conflicting action from executing.
5. The agent MUST NOT choose a closest, approximate, substitute, or fallback GUI option unless the user explicitly allowed that deviation.
6. Consequential or irreversible actions MUST require fresh evidence for all correctness-critical constraints.
7. Missing correctness-critical evidence MUST result in `ESCALATE` or `STOP`, not a guessed `PROCEED`.
8. Reversible observation/navigation actions MAY continue when they are needed to obtain evidence and cannot themselves violate a task constraint.
9. Unresolved conflicts MUST persist across retries, subagent handoffs, context compaction, and resumed sessions until new evidence resolves them.
10. Action generation MUST consume the feasibility decision; it MUST NOT independently override a `STOP` or `ESCALATE` result.
11. Any human override of a blocking conflict MUST be explicit, scoped to the specific conflict/action, and recorded without exposing sensitive data.
12. Verification MUST include both conflict cases and feasible controls so a system cannot improve safety by refusing everything.
13. Retry loops MUST be bounded: evidence refresh may retry at most 2 times unless a human authorizes additional investigation.
14. Completion MUST distinguish Implemented, Measured, and Verified.
15. The package MUST NOT request or expose hidden chain-of-thought; observable facts, constraints, conflicts, decisions and evidence are sufficient.
