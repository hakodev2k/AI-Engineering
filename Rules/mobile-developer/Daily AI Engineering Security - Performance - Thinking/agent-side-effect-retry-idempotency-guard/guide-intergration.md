# Integration Guide

## Goal

Insert the guard between **agent intent** and **actual state-changing tool dispatch**. The guard does not replace tool authentication, authorization, sandboxing, or provider retry controls. Its job is narrower: prevent one logical action from being executed again merely because the runtime is uncertain about the prior attempt.

## 1. Inventory tool semantics

For every tool exposed to the agent, record:

- canonical server/tool identity;
- `read_only`, `idempotent_write`, or `non_idempotent_write`;
- whether downstream idempotency is real and verified;
- idempotency key scope and retention;
- available read-only side-effect probe;
- compensation/rollback options;
- risk level and human-approval boundary.

Unknown tools default to `non_idempotent_write`.

## 2. Choose a durable operation store

The bundled script uses a local JSON file for demonstration/integration testing. Production multi-worker systems should implement the same state machine over a durable store with atomic conditional insert/update, such as PostgreSQL, SQL Server, Redis with an appropriate durability model, or another transactional store.

Required fields are described in `schemas/invocation-record.schema.json`.

Important ordering invariant:

```text
reserve -> persist in_progress -> dispatch -> persist outcome
```

Do not dispatch a non-idempotent operation if reservation/in-progress persistence failed.

## 3. Define logical intent IDs

A logical intent ID must survive retries, provider fallback, reconnect, resume, and worker handoff. It must change for a genuinely new user-requested action.

Good examples:

```text
incident-421-create-ticket
release-2026-08-20-prod-deploy
user-request-983-send-summary
```

Avoid using a transport request ID if the transport generates a new one for every retry.

## 4. Reserve before dispatch

Create a validated argument JSON file and reserve:

```bash
python scripts/idempotency_guard.py reserve \
  --ledger .agent/idempotency-ledger.json \
  --server github \
  --tool create_issue \
  --arguments-file issue-args.json \
  --intent-id incident-421-create-ticket \
  --classification non_idempotent_write
```

Only a `reserved` decision allows a new dispatch. `replay`, `block`, and `reject_conflict` must be handled without executing the tool.

## 5. Mark the actual attempt

Immediately before handing control to the tool transport:

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state in_progress
```

The attempt count measures actual dispatch attempts, not model thoughts or planning retries.

## 6. Record outcome precisely

### Successful result received

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state completed \
  --result-reference "issue://1234"
```

### Proven failure before side effect

Use `known_failed` only when evidence proves no external effect committed—for example local argument validation failed before network dispatch.

### Ambiguous result

Timeout, disconnect, provider fallback, worker crash, or response loss after dispatch begins should become:

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state outcome_unknown \
  --failure-reason "response lost after dispatch"
```

## 7. Gate every retry

```bash
python scripts/idempotency_guard.py retry-decision \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --policy config/idempotency-policy.json
```

A new dispatch is permitted only on `retry`. `replay`/`replay_or_reconcile` means do not execute again. `block` means resolve ambiguity or escalate.

## 8. Integrate side-effect probes

A probe is a read-only query that determines whether the exact intended effect is already present. The host—not the model—should collect observations and serialize them:

```json
{
  "operation_key": "op_example",
  "checks": [
    {"name": "resource_exists", "status": "present", "evidence": "issue://1234"},
    {"name": "payload_matches", "status": "present", "evidence": "sha256:abc"}
  ]
}
```

Evaluate:

```bash
python scripts/side_effect_probe.py \
  --probe probe.json \
  --require resource_exists \
  --require payload_matches
```

Never interpret a missing/failed probe as `effect_absent`.

## 9. MCP integration

Until request-level idempotency is universally supported, treat MCP idempotency as a negotiated capability rather than an assumption.

When a server supports a standardized or well-documented idempotency key:

1. generate the key from the host logical operation identity;
2. preserve it across retries;
3. verify the SDK/adapter forwards it end-to-end;
4. verify conflict behavior for same key/different arguments;
5. verify retention covers the runtime's retry/resume horizon.

If any step is unverified, keep host-side ambiguous-outcome blocking enabled.

## 10. Provider fallback and replay

Fallback logic must inherit the same operation ledger. A replacement model must not be shown a clean slate that causes already-dispatched writes to be regenerated blindly.

Before accepting a fallback-generated write call, reserve using the original stable intent ID. The existing record will force replay/block/conflict behavior.

## 11. Multi-worker concurrency

The JSON reference implementation is suitable for single-process/local integration tests. In multi-worker production:

- use atomic `INSERT IF ABSENT`/compare-and-set;
- reject or wait on `in_progress` duplicates;
- do not rely on process-local mutexes;
- define TTL/retention longer than the maximum reconnect/resume/retry horizon;
- keep completed records long enough to catch delayed duplicate messages.

## 12. Rollout

1. Observe only: compute keys and log would-block decisions.
2. Enable blocking for a small set of high-risk tools.
3. Measure duplicate incidents, false blocks, ambiguity rate, and latency.
4. Add probes for the largest unresolved ambiguity classes.
5. Expand to all state-changing tools.
6. Make policy regression tests mandatory for retry/fallback/runtime upgrades.

## 13. Verification

Run:

```bash
python -m unittest tests/test_idempotency_guard.py
```

Also inject a real staging lost-response scenario where possible: let the downstream side effect commit, suppress the response, then verify the retry path does not execute the effect again.

## Safety notes

- Never include secrets in intent IDs, keys, result references, or failure reasons.
- Human approval is a last-resort boundary for unresolved ambiguity, not a mechanism to automatically erase uncertainty.
- For financial, destructive, or externally visible operations, prefer downstream-native idempotency plus host-side guarding.
- This package provides at-most-once-style protection at the orchestration boundary; it does not promise mathematical exactly-once execution across every crash point in a distributed system.