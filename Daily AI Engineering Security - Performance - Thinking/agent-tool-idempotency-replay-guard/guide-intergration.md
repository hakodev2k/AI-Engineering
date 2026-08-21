# Integration Guide

## Goal
Insert an idempotency boundary between agent/runtime retries and side-effecting providers so retries remain available without blindly repeating business effects.

## 1. Build the tool registry
For each production tool record:
- effect class: `read`, `idempotent-write`, `non-idempotent-write`;
- business identity fields;
- provider-native idempotency support;
- provider/result lookup strategy for reconciliation.

Validate:
```bash
python scripts/idempotency_guard.py validate-registry --registry examples/tool-registry.json
```

Unknown-effect tools must not be treated as safe writes.

## 2. Define operation identity
Create the operation key from stable business fields, not runtime-attempt metadata.

Example:
```bash
python scripts/idempotency_guard.py key \
  --tenant tenant-a \
  --workflow checkout \
  --tool create_payment \
  --scope order-1042 \
  --args-json '{"amount_minor":1250,"currency":"USD"}'
```

For real payment/email/order tools, prefer a domain identifier such as order ID, campaign-recipient ID, command ID, or upstream request ID. Do not include retry number or trace ID unless it changes business meaning.

## 3. Use durable shared storage
The reference script uses SQLite for deterministic local tests. Multi-worker production deployments should implement the same state machine on a storage system with atomic uniqueness/conditional writes, for example PostgreSQL, SQL Server, Redis with durable semantics appropriate to the workload, or a managed database.

Required states:
- `in_progress`: exactly one current reservation owner;
- `completed`: provider effect confirmed and reusable result/reference stored;
- `unknown`: request may have reached provider but result is ambiguous.

Required invariant:
`operation_key` is unique within its security/business namespace.

## 4. Wrap tool execution
Pseudocode at the integration boundary:
```text
classification = registry[tool]
if classification == read:
    execute under read retry policy
else:
    key = build_operation_key(...)
    reservation = ledger.reserve(key)

    if reservation.completed:
        return reservation.saved_result
    if reservation.in_progress:
        bounded_wait_or_duplicate_response()
    if reservation.unknown:
        return reconcile_before_retry()

    try:
        result = provider.call(idempotency_key=key when supported)
    except ambiguous_transport_failure:
        ledger.mark_unknown(key)
        return reconcile_before_retry()
    except confirmed_pre_dispatch_failure:
        release_or_retry_under_same_key()
    else:
        ledger.complete(key, result)
        return result
```

The guard must run outside the model. A prompt rule is not a durable concurrency primitive.

## 5. Reconciliation adapters
Implement provider-specific `lookup(operation_key)` behavior when possible.

Examples:
- payments: query by provider idempotency key/order reference;
- email: application outbox table keyed by operation key, then provider message ID if available;
- job enqueue: durable job table with unique command ID;
- database mutation: read target version/business key and verify intended state;
- webhook/API write: query provider resource by client request ID if supported.

Reconciliation outputs should be one of:
- `effect-confirmed(result)`;
- `no-effect-confirmed`;
- `still-unknown`.

Only `no-effect-confirmed` can authorize another non-idempotent provider execution automatically.

## 6. Runtime retry integration
Framework retry IDs must not replace the operation key. Pass the same logical key through:
- model-emitted duplicate tool calls;
- node retries;
- parent/subagent retries;
- checkpoint resume/replay;
- queue redelivery;
- process restart.

A new retry attempt may get a new trace/span/attempt ID while keeping the same operation key.

## 7. Metrics
Emit at minimum:
```text
idempotency_reservation_total{status}
idempotency_completed_hit_total{tool}
idempotency_provider_execution_total{tool}
idempotency_duplicate_suppressed_total{tool}
idempotency_unknown_total{tool}
idempotency_reconciliation_total{outcome}
idempotency_guard_latency_ms
idempotency_collision_rejected_total
```

Compare logical operations with provider executions. For a protected non-idempotent operation the healthy ratio is normally one provider execution per new operation and zero additional executions for completed replays.

## 8. Baseline existing traces
Export normalized JSONL records and run:
```bash
python scripts/replay_probe.py attempts.jsonl --fail-on-duplicate
```
This identifies operation keys with multiple recorded provider executions and estimates avoidable calls.

## 9. Test matrix
Required before rollout:
1. two identical sequential attempts;
2. 20 concurrent identical attempts;
3. same arguments across different tenants;
4. crash before provider dispatch;
5. crash/response loss after provider success but before local completion persistence;
6. retry after timeout;
7. completed-result replay;
8. two legitimate operations with similar arguments but different business scope;
9. stale lease with confirmed provider success;
10. stale lease with confirmed no effect.

## 10. Rollout
Start with shadow metrics, then enforce on a low-risk write tool, compare guard latency and suppression accuracy, expand to higher-impact tools, and retain fail-closed behavior for high-value writes when ledger/reconciliation is unavailable.

## Safety
Do not log secrets or full sensitive provider payloads in the ledger. Store compact result data, stable identifiers, hashes, or protected references. Tenant/security scope must participate in keying and authorization checks.
