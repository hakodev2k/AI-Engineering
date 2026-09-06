# Error Handling and Compensation

## Purpose
Design failure handling that preserves business consistency across workflows whose side effects cannot share one atomic transaction.

## When to use
Use when workflows perform multiple external writes, provisioning steps, financial actions, or other operations where later failure can leave partial completion.

## Inputs
Side-effect sequence, reversibility, transaction boundaries, business invariants, error taxonomy, recovery operators, and audit requirements.

## Context to inspect
Inspect each dependency's transaction semantics, undo operations, idempotency support, partial-success responses, and historical failure cases.

## Core knowledge
Distributed workflows cannot generally roll back external effects atomically. Compensation is a new business action, not a time-reversed database transaction, and may itself fail. Some effects require forward recovery rather than reversal.

## Procedure
1. Enumerate side effects in execution order.
2. Define business invariants that must hold at completion.
3. Classify each effect as reversible, compensatable, replaceable, or irreversible.
4. Identify commit points after which rollback is inappropriate.
5. Define error categories and ownership.
6. For each partial state, choose retry, compensate, continue, quarantine, or escalate.
7. Make compensation idempotent and independently observable.
8. Persist enough state to resume recovery after restart.
9. Define manual recovery instructions for exceptional states.
10. Test failure after every side effect, including failed compensation.
11. Monitor incomplete and compensating workflow states.

## Decision points
Compensate when a safe inverse business action exists. Prefer forward recovery when reversal would create more risk. Escalate irreversible partial states rather than masking them.

## Common failure patterns
Assuming remote rollback, deleting evidence during compensation, compensating after business handoff, recursive recovery loops, and unmonitored partial states.

## Verification
Fault-inject at each step and confirm the workflow converges to an allowed terminal state with a complete audit trail and no duplicated compensation.

## Expected output
A recovery matrix mapping failures and partial states to retry, compensation, forward recovery, quarantine, or escalation.

## Stop conditions
Stop when a high-impact partial state has no approved recovery path or when compensating actions require permissions/authority not yet defined.