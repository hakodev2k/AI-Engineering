# Hooks

## Hook 1 — Pre-task baseline seal

**Trigger:** Approved plan is about to enter execution.  
**Action:** Normalize obligations, calculate baseline SHA-256, persist ledger outside freely mutable agent scratch state, and validate it.  
**Command:**

```bash
python scripts/ledger_guard.py hash --tasks approved-tasks.json
python scripts/ledger_guard.py validate --ledger progress-ledger.json --policy config/ledger-policy.json
```

**Expected result:** Hash is recorded in `baseline.sha256`; validation exits 0.  
**Failure behavior:** Do not start implementation. Fix task identity/serialization problems or obtain human re-approval if requirements changed.

## Hook 2 — Post-transition integrity check

**Trigger:** Any requested progress transition is appended.  
**Action:** Replay the complete event stream and validate transition legality, task identity, sequence continuity, completion evidence, and cancellation approval.  
**Command:**

```bash
python scripts/ledger_guard.py validate --ledger progress-ledger.json --policy config/ledger-policy.json
```

**Expected result:** Exit 0 and deterministic derived state.  
**Failure behavior:** Reject the latest transition; preserve the invalid attempt in harness/audit logs; do not edit previous valid events.

## Hook 3 — Pre-stop / pre-final-response gate

**Trigger:** Agent attempts to stop, emit final answer, create a success signal, or allow a headless process to report semantic success.  
**Action:** Check all original mandatory obligations against the full event history.  
**Command:**

```bash
python scripts/ledger_guard.py gate --ledger progress-ledger.json --policy config/ledger-policy.json
```

**Expected result:** Exit 0 only if integrity is valid and every mandatory task has an approved terminal disposition.  
**Failure behavior:** Block semantic success. Continue only for explicit blocking task IDs and within configured retry limits; otherwise report incomplete/blocked.

## Hook 4 — Baseline drift detector

**Trigger:** Task tracker, plan, epic file, or orchestration state is rewritten during execution.  
**Action:** Recompute the approved baseline hash from the retained original obligation array and compare it with `baseline.sha256`.  
**Command:**

```bash
python scripts/ledger_guard.py hash --tasks approved-tasks.json
```

**Expected result:** Exact digest match with the sealed baseline.  
**Failure behavior:** Freeze progress writes, preserve current artifacts, run the manipulation-recovery workflow, and require human re-approval if the original obligation set cannot be reconstructed confidently.

## Hook 5 — High-risk independent verification

**Trigger:** `risk` equals `high` before completion.  
**Action:** Route the ledger, original requirements, repository diff, and validation evidence to an independent verifier; write verifier identity/reference to host-controlled ledger metadata.  
**Command:** Host-specific verifier invocation followed by:

```bash
python scripts/ledger_guard.py gate --ledger progress-ledger.json --policy config/ledger-policy.json
```

**Expected result:** Independent verifier is recorded and gate passes.  
**Failure behavior:** Do not let the implementing agent self-certify the run. Escalate or leave the run blocked.

## Hook 6 — Final audit preservation

**Trigger:** Run reaches complete, blocked, cancelled, or retry exhaustion.  
**Action:** Persist the sealed baseline, append-only events, gate report, policy version, and sanitized evidence references.  
**Expected result:** Another process can replay the run without relying on the model's final prose summary.  
**Failure behavior:** Treat missing audit preservation as an observability failure; do not destroy existing ledger/evidence while retrying storage.