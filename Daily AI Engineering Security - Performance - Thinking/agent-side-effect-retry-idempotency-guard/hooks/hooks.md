# Hooks

## Hook 1 — Pre-dispatch Reservation

**Trigger:** Immediately before any state-changing tool call.  
**Action:** classify the tool, compute/reserve the logical operation key, and block on duplicate/conflict.  
**Command:**

```bash
python scripts/idempotency_guard.py reserve \
  --ledger .agent/idempotency-ledger.json \
  --server "$SERVER" \
  --tool "$TOOL" \
  --arguments-file "$ARGS_JSON" \
  --intent-id "$INTENT_ID" \
  --classification "$CLASSIFICATION"
```

Add `--downstream-idempotency` only when the downstream guarantee has been verified.  
**Expected result:** `reserved` for a new logical operation, `replay` for completed duplicate, or a nonzero block/conflict.  
**Failure behavior:** fail closed for write tools.

## Hook 2 — Dispatch Started

**Trigger:** After reservation succeeds but before handing control to the tool transport.  
**Action:** transition to `in_progress`, incrementing the attempt count.  
**Command:**

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state in_progress
```

**Expected result:** attempt counter increments exactly once for each actual dispatch.  
**Failure behavior:** do not dispatch if the durable transition cannot be recorded.

## Hook 3 — Post-success Completion

**Trigger:** Tool result is successfully received and validated.  
**Action:** persist `completed` plus a safe result reference/digest.  
**Command:**

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state completed \
  --result-reference "$RESULT_REF"
```

**Expected result:** future duplicates are replayed/reconciled instead of re-executed.  
**Failure behavior:** if the external effect committed but local completion persistence fails, mark/recover as `outcome_unknown`; never assume failure.

## Hook 4 — Ambiguous Transport Failure

**Trigger:** timeout, disconnect, provider fallback, worker crash, lost response, or transport reset after dispatch began.  
**Action:** persist uncertainty.  
**Command:**

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state outcome_unknown \
  --failure-reason "$SAFE_REASON"
```

**Expected result:** automatic blind retry is blocked for non-idempotent writes.  
**Failure behavior:** if ledger write itself fails, suspend automatic write retries and escalate.

## Hook 5 — Side-effect Probe

**Trigger:** a non-idempotent operation is `outcome_unknown` and a deterministic read-only probe exists.  
**Action:** host obtains read-only observations and passes them to the probe evaluator.  
**Command:**

```bash
python scripts/side_effect_probe.py \
  --probe probe-result.json \
  --require resource_exists \
  --require payload_matches
```

Then record the returned probe status:

```bash
python scripts/idempotency_guard.py transition \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --state outcome_unknown \
  --probe-status effect_absent
```

**Expected result:** present/absent/unknown with evidence references.  
**Failure behavior:** preserve unknown; do not convert an inconclusive probe to absence.

## Hook 6 — Pre-retry Gate

**Trigger:** any retry request after a failed or ambiguous attempt.  
**Action:** deterministic retry decision.  
**Command:**

```bash
python scripts/idempotency_guard.py retry-decision \
  --ledger .agent/idempotency-ledger.json \
  --operation-key "$OP_KEY" \
  --policy config/idempotency-policy.json
```

**Expected result:** `retry`, `replay`, `replay_or_reconcile`, or `block`.  
**Failure behavior:** only `retry` permits another dispatch.

## Hook 7 — Final Verification

**Trigger:** before deployment/enabling automatic retries for state-changing tools.  
**Action:** run regression suite and inspect operational metrics.  
**Command:**

```bash
python -m unittest tests/test_idempotency_guard.py
```

**Expected result:** all invariant tests pass.  
**Failure behavior:** disable automatic write retries or roll back the integration; never reduce the assertions to obtain green tests.