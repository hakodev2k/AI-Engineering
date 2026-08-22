# Engineering Rules

## MUST
- MUST derive idempotency identity from stable semantic intent, not worker/process/retry IDs.
- MUST claim the durable ledger before every protected external side effect.
- MUST treat provider timeout, disconnect, worker crash, or expired claim after possible transmission as **uncertain**, not automatically failed.
- MUST reuse a completed result for the same operation key instead of invoking the provider again.
- MUST use provider-native idempotency keys when available and align them with the local stable operation key.
- MUST keep the ledger on storage shared by all workers capable of executing the same logical operation.
- MUST make claim acquisition atomic; two concurrent workers may not both receive `execute`.
- MUST reconcile uncertain high-risk effects before retry; payment, delete, provisioning, publishing, and external messaging require authoritative evidence or explicit human approval.
- MUST bound automated reconciliation to the configured maximum attempts.
- MUST test crash points before provider call, after provider success/before ledger completion, and after ledger completion.
- MUST record safe result references sufficient for replay verification when available.
- MUST distinguish `Implemented`, `Measured`, and `Verified` in release evidence.

## MUST NOT
- MUST NOT blind-retry an `uncertain` operation.
- MUST NOT assume a framework checkpoint alone provides exactly-once semantics for an external system.
- MUST NOT use read-before-write as the only concurrency guard when multiple workers can race.
- MUST NOT generate a fresh random idempotency key on each retry for the same semantic effect.
- MUST NOT put credentials, authorization headers, raw payment data, private message bodies, or unbounded provider responses in the ledger.
- MUST NOT resolve uncertainty as `retry` merely because the local checkpoint lacks a completion record.
- MUST NOT let the implementing agent be the sole verifier for high-risk effects.
- MUST NOT increase retry counts to hide duplicate-effect failures.
- MUST NOT automatically delete ambiguous ledger records to “unstick” a workflow.

## SHOULD
- SHOULD keep effect types narrow and business meaningful.
- SHOULD include a business version/revision in semantic input when a changed request intentionally represents a new effect.
- SHOULD expose ledger decisions as structured telemetry: `execute`, `reuse`, `wait`, `reconcile`.
- SHOULD alert on repeated uncertain states or long-lived in-progress claims.
- SHOULD prefer provider lookups by provider idempotency key or stable external object ID during reconciliation.
- SHOULD keep reconciliation read-only until a decision is reached.
- SHOULD use a dedicated durable store with transactional uniqueness in production; SQLite in this package is a reference implementation and local/single-host baseline.
- SHOULD rerun crash/replay verification after runtime, checkpointer, queue, or provider integration upgrades.

## Observable acceptance rules
1. Same semantic operation invoked twice after completion => second invocation returns reuse and provider call count does not increase.
2. Two simultaneous claims for the same operation => at most one execute decision.
3. Expired in-progress claim => state transitions to uncertain and execution remains blocked.
4. Uncertain high-risk operation => no retry release without reconciliation evidence or human approval.
5. Ledger inspection => no secret or raw sensitive payload stored.
6. Crash/restart test matrix => zero duplicate external effects.
