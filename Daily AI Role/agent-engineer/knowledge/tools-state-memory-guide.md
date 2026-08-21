# Tools, State, and Memory Guide

## Tool quality
Good tools expose narrow operations, typed inputs, structured outcomes, explicit errors, timeout/cancellation behavior, and side-effect metadata. Avoid tools that return only prose like `something went wrong`.

## Side-effect classes
1. Read-only.
2. Local/reversible write.
3. External reversible write.
4. External consequential write.
5. Irreversible/destructive or policy-sensitive action.

Increase evidence, approval, idempotency, and verification requirements by class.

## Execution state
Store task id, stage, dependency status, tool operations, external effects, approvals, retry counters, decisions, pending actions, and next safe transition.

## Memory
Durable memory should contain useful stable facts or explicit user/domain decisions, not raw scratch reasoning. Store provenance and freshness. Sensitive data needs explicit policy.

## Recovery invariant
Before resuming after uncertainty, ask: `What is the authoritative external state now?` Do not assume the last attempted action succeeded or failed.

## Multi-agent shared context
Share contracts, decisions, interfaces, blockers, and evidence references. Avoid copying large uncurated histories into every worker.