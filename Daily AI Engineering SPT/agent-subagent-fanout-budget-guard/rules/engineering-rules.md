# Engineering Rules

## MUST
- MUST assign every root task a stable `root_task_id` and a hard delegation budget before the first spawn.
- MUST enforce `max_descendants`, `max_depth`, `max_concurrency`, token budget, wall-time budget, and tool-call budget at runtime rather than only in prompts.
- MUST require an explicit child budget for every spawn.
- MUST make each child budget less than or equal to its parent's delegable remaining budget.
- MUST make spawn admission and reservation atomic in multi-worker/distributed runtimes.
- MUST use an idempotency key for every spawn request so retries do not create another child.
- MUST deny recursive delegation when the child has no delegated descendant budget.
- MUST preserve root-level token/time headroom for synthesis, verification, and failure recovery.
- MUST record planned fan-out and actual fan-out separately.
- MUST account for children recursively against the same root budget.
- MUST treat unknown usage as still consuming its reservation until reconciliation or expiry handling completes.
- MUST deny new spawns once any hard root limit is reached.
- MUST expose a machine-readable denial reason to the orchestrator.
- MUST freeze spawn admission before attempting incident cleanup when fan-out is anomalous.
- MUST keep a bounded cancellation grace period and report orphaned descendants.
- MUST preserve available partial results before cancelling descendants when safe and possible.
- MUST require explicit human approval to raise hard limits during an active incident.

## MUST NOT
- MUST NOT allow a child to inherit unrestricted access to agent-spawn tools by default.
- MUST NOT use provider account quota exhaustion as the primary stop mechanism.
- MUST NOT increase recursion, token, concurrency, or descendant limits automatically merely because a task is not finished.
- MUST NOT assume a concurrency semaphore bounds cumulative descendant count.
- MUST NOT refund actual consumed usage when a child fails.
- MUST NOT treat an LLM statement such as “I will only spawn five agents” as enforcement.
- MUST NOT permit a retry to bypass a previous denied spawn request by changing only a request identifier.
- MUST NOT hide budget denials by silently switching to more expensive models or wider fan-out.
- MUST NOT allow unlimited retries in planning, spawn admission, reconciliation, cancellation, or synthesis.

## SHOULD
- SHOULD default general-purpose subagents to `can_delegate=false` unless nested delegation materially improves the workflow.
- SHOULD use the smallest worker count that covers independent work units.
- SHOULD reserve at least 20% of root token budget for parent synthesis and verification for research-style tasks unless measured history supports another value.
- SHOULD alert when 75% of any hard budget is consumed.
- SHOULD measure spawn velocity and flag sudden deviations from the planned tree.
- SHOULD track estimate-versus-actual token error per subagent type and improve reservations from historical data.
- SHOULD prefer deterministic batch/subflow execution when a repeated delegation shape is stable.
- SHOULD attach partial-result pointers to terminal child events.
- SHOULD periodically detect expired reservations and orphan descendants.
- SHOULD include budget contract regression tests in CI for any orchestration change.