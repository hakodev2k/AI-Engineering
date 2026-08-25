# Skill: Delegation Handshake

## Purpose
Prove that a child agent received the exact delegated task before task-specific execution.

## Trigger
Asynchronous/named child spawn, or material follow-up instruction.

## Inputs
Child identity, canonical task text, sequence number, allowed scope, ACK deadline.

## Preconditions
Parent can observe child events or an adapter can emit delivery/ACK events. Task hash uses SHA-256 of canonical UTF-8 task bytes.

## Required context
Parent goal, child scope, permissions, expected output, retry budget.

## Allowed tools
Spawn/message APIs, read-only traces, `scripts/delivery_guard.py`, cancellation tool, test runner.

## Constraints
Do not widen permissions to recover delivery. Do not accept liveness, idle, or enqueue success as an ACK. Do not infer ACK from child output.

## Procedure
1. Canonicalize task; compute SHA-256 and assign `seq=1`.
2. Spawn child and record `spawn_requested`.
3. Deliver task with hash and sequence.
4. Child records `task_acknowledged` with exact hash/sequence before first task-specific action.
5. Parent validates ACK and only then marks delegation active.
6. For material follow-ups, increment sequence and require matching follow-up ACK before relying on changed instructions.
7. Run validator at completion.
8. Independent verifier checks final output corresponds to last acknowledged task sequence.

## Decision points
Missing ACK by deadline → one redelivery. Hash/sequence mismatch → reject immediately and redeliver canonical task. Second delivery failure → cancel/re-spawn once. Second child failure → stop delegation.

## Expected output
Acknowledged task identity, delivery latency, final sequence, violations, recovery status.

## Metrics
ACK rate/latency, mismatches, retries, action-before-ACK count.

## Verification
Validator exits 0 and independent verifier confirms output scope matches acknowledged task.

## Failure handling
At most one redelivery and one re-spawn. Preserve evidence and fall back to parent execution or explicit failure after exhaustion.

## Stop conditions
Verified completion, cancellation after retry budget, or inability to observe ACK safely.