# Lifecycle Hooks

- **before_task_start:** validate task contract, permissions, side-effect class, and required context.
- **after_plan:** validate dependency graph, loop bounds, owners, stop conditions, and approval gates.
- **before_tool_call:** validate schema, permission, idempotency/retry safety, timeout, and expected evidence.
- **after_tool_call:** normalize result, record evidence/external effect, and reconcile partial success.
- **before_checkpoint:** ensure completed/pending work, decisions, retry counters, operation ids, approvals, and next safe action are serializable.
- **before_delegation:** validate subagent scope, tools, output contract, and maximum depth.
- **after_review:** block progression on unresolved blocker findings.
- **before_consequential_action:** require configured human approval when action class demands it.
- **on_failure:** freeze unsafe continuation, classify failure, enforce retry budget, and create recovery handoff.
- **before_finish:** require verifier evidence for every acceptance criterion.

Hooks should be deterministic, minimal, idempotent when possible, and must fail closed on permission uncertainty.