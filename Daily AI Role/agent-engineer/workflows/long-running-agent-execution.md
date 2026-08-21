# Workflow: Long-Running Agent Execution

**Trigger:** A task spans many steps, tools, context windows, or external waits.

**Goal:** preserve progress safely and resume without duplicate effects.

## Stages
1. Create execution id and validated task contract.
2. Build task DAG; mark read-only, write, approval-gated, and waiting nodes.
3. Execute independent read-only nodes in parallel.
4. Before a consequential write, checkpoint state and verify permission.
5. After an external effect, record operation id, result, evidence, and reconciliation status before proceeding.
6. At context or worker boundary, write a handoff containing completed, pending, blockers, decisions, external effects, retry counters, and next safe action.
7. On resume, reconcile checkpoint with authoritative external state.
8. Verify final outcomes and close execution.

**Retries:** transient operations max two by default; non-idempotent write retry only after outcome reconciliation.

**Cancellation:** stop new work, preserve state, report in-flight external actions, and hand off safely.

**Definition of done:** final state is terminal, external effects are accounted for, and verification passes.