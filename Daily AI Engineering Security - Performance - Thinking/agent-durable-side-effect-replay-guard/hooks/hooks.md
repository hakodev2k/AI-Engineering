# Hooks

## Hook 1 — Pre-Effect Claim

**Trigger:** immediately before a protected mutation/tool/API call.

**Action:** canonicalize semantic inputs and request an atomic ledger claim.

**Command:**
```bash
python scripts/side_effect_guard.py --db .agent-state/side-effect-ledger.sqlite3 claim \
  --workflow-id "$WORKFLOW_ID" \
  --effect-type "$EFFECT_TYPE" \
  --owner "$ATTEMPT_OWNER" \
  --semantic-file "$SEMANTIC_INPUT_FILE"
```

**Expected result:** `decision=execute` for first owner, `reuse` for completed operation, `wait` for active claim, or `reconcile` for uncertain state.

**Failure behavior:** any non-execute decision MUST prevent the provider mutation. `reuse` returns cached reference; `wait` suspends/polls deterministically; `reconcile` enters recovery workflow.

---

## Hook 2 — Post-Success Completion

**Trigger:** provider reports success and a safe stable result reference is available.

**Action:** mark the operation completed immediately.

**Command:**
```bash
python scripts/side_effect_guard.py --db .agent-state/side-effect-ledger.sqlite3 complete \
  --op-key "$OP_KEY" --owner "$ATTEMPT_OWNER" --result-ref "$SAFE_RESULT_REF"
```

**Expected result:** `decision=completed` or `already_completed`.

**Failure behavior:** do not repeat the provider call. Preserve correlation evidence and allow the claim to become uncertain for reconciliation.

---

## Hook 3 — Resume/Restart State Check

**Trigger:** workflow resume, worker restart, queue redelivery, or retry callback.

**Action:** query the operation key before deciding to execute.

**Command:**
```bash
python scripts/side_effect_guard.py --db .agent-state/side-effect-ledger.sqlite3 status --op-key "$OP_KEY"
```

**Expected result:** caller explicitly handles `completed`, `in_progress`, `uncertain`, or missing.

**Failure behavior:** ledger read failure blocks protected mutation; do not “fail open.”

---

## Hook 4 — Uncertain Reconciliation

**Trigger:** an expired claim or ambiguous provider outcome transitions to `uncertain`.

**Action:** run read-only provider reconciliation. Only after authoritative evidence, execute one of:

```bash
python scripts/side_effect_guard.py --db .agent-state/side-effect-ledger.sqlite3 resolve \
  --op-key "$OP_KEY" --resolution completed --result-ref "$SAFE_RESULT_REF" --note "provider lookup confirmed"
```

or, only when authoritative absence/required approval exists:

```bash
python scripts/side_effect_guard.py --db .agent-state/side-effect-ledger.sqlite3 resolve \
  --op-key "$OP_KEY" --resolution retry --note "authoritative absence confirmed"
```

**Expected result:** `reconciled_completed` or `retry_released`.

**Failure behavior:** retain uncertain state; maximum two automated reconciliation attempts; high-risk ambiguity escalates to human approval.

---

## Hook 5 — Final Verification Gate

**Trigger:** before marking a workflow/integration complete or deployable.

**Action:** run deterministic tests and inspect ledger policy.

**Command:**
```bash
python -m unittest tests/test_side_effect_guard.py
```

**Expected result:** all tests pass; no duplicate execution path is observed.

**Failure behavior:** release is blocked. Do not reduce assertions or increase blind retries.
