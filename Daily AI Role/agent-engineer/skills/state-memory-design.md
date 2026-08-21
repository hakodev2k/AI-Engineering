# Skill: State and Memory Design

**Purpose:** Keep agents restartable and context-aware without turning memory into an unbounded data dump.

**Trigger:** Long-running workflows, repeated user interactions, resume/recovery needs, or multi-agent coordination.

**Inputs:** task lifecycle, data sensitivity, retention needs, consistency requirements, expected restart points.

## Procedure
1. Separate ephemeral reasoning context, execution state, durable task state, and long-term memory.
2. Store only facts/decisions needed for future behavior; attach provenance and timestamp.
3. Define authoritative source for each field and conflict resolution order.
4. Define checkpoint schema with task id, stage, completed actions, pending actions, external effects, approvals, retries, and next safe action.
5. Define memory write criteria, retention, redaction, update, and deletion rules.
6. Prevent duplicate side effects during resume using operation ids/idempotency keys.
7. Test crash-before-write, crash-after-external-effect, stale-memory, and concurrent-update cases.

**Constraints:** no secrets by default; no hidden user-profile inference as durable fact; no memory item without provenance when it can affect decisions.

**Output:** state model, checkpoint policy, memory policy, reconciliation rules.

**Quality:** a fresh worker can resume from checkpoint without guessing what happened.

**Failure:** if state and external reality disagree, inspect external truth before continuing.

**Stop:** restart and reconciliation tests pass.