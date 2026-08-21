# Integration Guide

## Purpose
Use this package when an AI agent or durable workflow can retry, resume, replay, or redeliver a task that performs an external mutation. The guard adds an application-owned idempotency boundary around the mutation so runtime recovery does not become duplicate business action.

## 1. Choose the protected effects
Inventory all operations that can change external state: email/message send, payment/charge, ticket/issue creation, database append, webhook emission, infrastructure provisioning, publishing, deletion, or custom API writes.

Do not wrap pure reads or deterministic local calculations unless they are expensive and you intentionally want result caching; this package is primarily about side-effect correctness.

## 2. Define semantic identity
For each effect define:

- `workflow_id`: stable logical business workflow/request identity.
- `effect_type`: narrow name such as `send_invoice_email`.
- semantic input: only fields that decide whether two attempts represent the same effect.

Example semantic file:

```json
{
  "customer_id": "cust-42",
  "invoice_id": "inv-2026-08",
  "delivery_channel": "email",
  "template_version": 3
}
```

Do not include worker IDs, retry counts, current timestamps, generated attempt UUIDs, credentials, auth headers, or volatile trace IDs.

## 3. Configure durable storage
The reference CLI uses SQLite. Set a path that survives process restart:

```bash
export SIDE_EFFECT_LEDGER=/var/lib/my-agent/side-effect-ledger.sqlite3
```

For multi-host production workloads, implement the same state machine on a shared transactional database with a unique primary key on `op_key`. SQLite is suitable for local/single-host baselines and integration tests; do not place independent SQLite files on separate workers and expect global deduplication.

Review `config/policy.json` for TTL, high-risk types, and uncertainty policy.

## 4. Claim before mutation

```bash
python scripts/side_effect_guard.py claim \
  --workflow-id "order-123" \
  --effect-type "send_invoice_email" \
  --owner "worker-7-attempt-1" \
  --semantic-file semantic.json
```

Handle decisions explicitly:

- `execute`: caller owns the claim and may invoke the provider.
- `reuse`: operation already completed; reuse `result_ref`, no provider call.
- `wait`: another owner is active; do not execute.
- `reconcile`: outcome may already exist externally; do not execute until reconciled.

Persist `op_key` in the workflow's safe execution metadata so resume handlers can query it directly.

## 5. Propagate idempotency downstream
If the external API supports idempotency keys, pass the returned local `op_key` (or a deterministic provider-compatible representation) as the provider idempotency key. This gives two layers:

1. local durable single-writer/replay control;
2. provider-side duplicate suppression.

Never generate a new provider idempotency key for the same semantic retry.

## 6. Complete immediately after provider success
Capture a safe stable provider reference, not the whole response:

```bash
python scripts/side_effect_guard.py complete \
  --op-key "$OP_KEY" \
  --owner "worker-7-attempt-1" \
  --result-ref "message-98342"
```

If this ledger update fails after remote success, **do not retry the provider call**. Recovery must treat the operation as uncertain.

## 7. Reconcile uncertainty
An expired `in_progress` claim becomes `uncertain`. Reconcile using read-only provider lookup by provider idempotency key, external object ID, or authoritative business key.

Provider confirms completion:

```bash
python scripts/side_effect_guard.py resolve \
  --op-key "$OP_KEY" --resolution completed \
  --result-ref "message-98342" \
  --note "provider lookup confirmed"
```

Provider authoritatively confirms absence and policy allows retry:

```bash
python scripts/side_effect_guard.py resolve \
  --op-key "$OP_KEY" --resolution retry \
  --note "authoritative absence confirmed"
```

A retry release deletes the old uncertain record, but the caller must claim the same semantic operation again before execution.

For payments, destructive operations, provisioning, publishing, and external messaging where lookup is ambiguous, require explicit human approval before release.

## 8. Integrate with agent frameworks

### LangGraph / checkpointed workflows
Place each non-idempotent provider call inside a task/node boundary **and** call the guard inside that task immediately around the external mutation. Checkpointing and the guard solve different layers: checkpoints reuse completed runtime work; the guard covers the external-success/local-completion crash window.

### Queue workers
Use the same semantic key across redeliveries. Queue message delivery IDs are attempt metadata and should not replace business identity.

### Multi-agent delegation
The delegating and worker agents must agree on the same operation-key contract. Do not let each subagent invent a new key. The host or deterministic helper should derive the key.

## 9. Run verification

```bash
python -m unittest tests/test_side_effect_guard.py
```

Then execute a provider-specific crash matrix in a non-production environment:

1. crash before provider call;
2. crash immediately after provider success but before `complete`;
3. crash after `complete`;
4. start two workers concurrently for the same semantic effect;
5. close/reopen process/storage and replay the request.

Required evidence is provider effect count, ledger transition, and replay decision for every scenario.

## 10. Production hardening
- Put the ledger in a durable transactional store shared by all workers.
- Restrict database permissions to the agent runtime identity.
- Encrypt storage according to application data policy.
- Log operation-key hashes and state transitions, not sensitive payloads.
- Alert on long-lived `in_progress` and repeated `uncertain` states.
- Back up ledger retention for at least as long as the provider's meaningful duplicate window.
- Ensure cleanup never removes active or uncertain records merely to unblock execution.

## Rollout sequence
1. Observe only: derive keys and log safe hashes without blocking.
2. Shadow claim in non-production and compare expected duplicate identities.
3. Enable blocking on low-risk effects.
4. Run crash/replay tests.
5. Enable high-risk effects only after reconciliation paths and human approval boundaries are verified.
