# Engineering Rules

## MUST
1. MUST classify every registered tool as `read`, `idempotent-write`, or `non-idempotent-write` before production use.
2. MUST compute or require a stable logical `operation_key` before executing any write.
3. MUST include tenant/security scope in operation identity.
4. MUST persist write reservations in durable shared storage before provider execution.
5. MUST return a stored completed result instead of re-executing the provider for the same operation key.
6. MUST reconcile ambiguous write outcomes before retrying.
7. MUST propagate provider-native idempotency keys when supported.
8. MUST use bounded leases, retries, waits, and reconciliation attempts.
9. MUST record operation state transitions without storing secrets.
10. MUST distinguish `failed` from `unknown`; a timeout after dispatch is not proof of no side effect.
11. MUST preserve the same operation key across runtime retry, checkpoint replay, parent retry, subagent retry, and worker restart.
12. MUST measure guard overhead and duplicate calls avoided.

## MUST NOT
1. MUST NOT use runtime attempt ID, trace ID, timestamp, or model call ID as the sole business idempotency key.
2. MUST NOT retry a non-idempotent write after an ambiguous failure without reconciliation or explicit human approval.
3. MUST NOT keep the only dedup state in process memory.
4. MUST NOT let separate tenants share an operation key namespace.
5. MUST NOT treat checkpoint completion as proof an external provider effect was committed exactly once.
6. MUST NOT generate a fresh key merely because a previous attempt timed out.
7. MUST NOT collapse two calls only because their tool names match; business-significant arguments and scope must participate in identity.
8. MUST NOT retain large sensitive provider responses directly in the ledger when a hash/reference is sufficient.
9. MUST NOT use unlimited polling for an in-progress duplicate.
10. MUST NOT silently steal an expired reservation for a write before checking whether the original effect occurred.

## SHOULD
1. SHOULD prefer provider-native business/idempotency identifiers over inferred argument hashes.
2. SHOULD make operation-key schema version explicit.
3. SHOULD use database uniqueness/conditional-write primitives for reservation atomicity.
4. SHOULD store result hashes and compact replay-safe summaries.
5. SHOULD expose counters for `reserved`, `suppressed`, `completed-hit`, `unknown`, `reconciled-success`, `reconciled-no-effect`, and `collision-rejected`.
6. SHOULD separate retry policy by effect class.
7. SHOULD run crash-after-dispatch and concurrent-duplicate tests before production rollout.
8. SHOULD alert when unknown outcomes exceed the service baseline.
9. SHOULD retain enough ledger history to cover the maximum replay/retry horizon.
10. SHOULD choose fail-closed behavior for high-value writes when identity or durable storage is unavailable.

## Observable checks
| Rule | Check |
|---|---|
| Stable identity | Same business operation across different attempt IDs hashes to same key |
| Tenant isolation | Same arguments in different tenants produce different keys |
| Atomic reservation | 20 concurrent attempts yield one owner |
| Completed reuse | Repeated completed call returns stored result without provider invocation |
| Ambiguous handling | Timeout-after-dispatch enters `unknown` and reconciliation |
| Bounded recovery | Retry/reconcile counters never exceed policy |
| Performance | provider calls avoided and guard p95 latency are emitted |
